
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const body = document.getElementById("body");

// const API_KEY = "AIzaSyCu4znECfXCutH07IzgcdbEFoSyzUqkpG0";
// const API_KEY = "AIzaSyDi2Dh2lyrIFTQqbtiNYY-dfNCrb8gDXU0";
// const API_KEY = "AIzaSyDWA7ibwh-ih_oNds31MD5e0aKdrBd3RJU"; 
// const API_KEY = "AIzaSyAX4mX5elU3n_O7QOWvAcIa3doVAotRW30";
// const API_KEY = "AIzaSyA2xcLh-3cs-SV4kNyOWN0OMdc9uR-QUx8";
// const API_KEY = "AIzaSyA1p3UY00G4OcuCxYOzZA2QgqBmSXI5puU";
// const API_KEY = "AIzaSyCEPRZX12-661oGy2OlNL162DWyqUBbnjo"
const API_KEY = "AIzaSyD5gq-If5c-ULOW_i97T8NTc5DTMr4-Tmc";

async function searchVideos(searchQuery, maxResult, typeOfDetails) {
  body.innerHTML = ``;
  try {
    const response = await fetch(
      BASE_URL +
        "/search" +
        `?key=${API_KEY}
        &part=${typeOfDetails}
        &q=${searchQuery}
        &maxResults=${maxResult}`
    );
    const data = await response.json();
    data.items.forEach((item) => {
      item.id = item.id.videoId;
      getChannelIcon(item);
    });
  } catch (e) {
    console.log(e);
  }
}
searchVideos("random", 50, "snippet");

async function fetchVideoStats(vid_data, typeOfDetails) {
  try {
    const response = await fetch(
      BASE_URL +
        "/videos" +
        `?key=${API_KEY}
        &part=${typeOfDetails}
        &id=${vid_data.id}`
    );
    const data = await response.json();
    if (typeOfDetails === "contentDetails") {
      return convertISO8601DurationToReadableTime(
        data.items[0].contentDetails.duration
      );
    }
    let statisticsObj = {
      viewCount : formatViewCount(data.items[0].statistics.viewCount),
      likeCount : formatViewCount(data.items[0].statistics.likeCount),
      fullViewCount:data.items[0].statistics.viewCount
    }
    return statisticsObj;
  } catch (e) {
    console.log(e);
  }
}
// fetchVideoStats("uV50UfcIT68","contentDetails")
// // to get duration of videos in pt format pt is a period of time

// // to get the views count, likes count,

async function fetchChannelLogo(channelId) {
  try {
    const response = await fetch(
      BASE_URL +
        "/channels" +
        `?key=${API_KEY}
          &part=snippet
          &id=${channelId}`
    );
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
// fetchChannelLogo("UCt2JXOLNxqry7B_4rRZME3Q")




async function fetchVideo() {
  body.innerHTML = ``;
  try {
    const response = await fetch(
      video_http +
        new URLSearchParams({
          key: API_KEY,
          part: "snippet",
          chart: "mostPopular",
          maxResults: 50,
          regionCode: "IN",
        })
    );
    const data = await response.json();
    data.items.forEach((item) => {
      console.log(item.snippet.publishedAt);
      const publishedAt = timeAgo(item.snippet.publishedAt);
      getChannelIcon(item,publishedAt);
    });
  } catch (e) {
    console.log(e);
  }
}
async function getChannelIcon(video_data,publishedAt) {
  try {
    const response = await fetch(
      channel_http +
        new URLSearchParams({
          key: API_KEY,
          part: "snippet",
          id: video_data.snippet.channelId,
        })
    );
    const data = await response.json();
    video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
    const duration = await fetchVideoStats(video_data, "contentDetails");
    const Count = await fetchVideoStats(video_data,"statistics");
    // console.log();
    makeVideoCard(video_data, duration,Count.viewCount,publishedAt);
  } catch (e) {
    console.log(e);
  }
}

const makeVideoCard = (data, duration, viewCount,publishedAt) => {
  const videoContainer = document.createElement("div");
  videoContainer.innerHTML = `
  <div class="video">
      <div class="faic">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="time faic">${duration}</div>
      </div>
      <div class="content">
          <img src="${data.channelThumbnail}" class="channel-icon" alt="">
          <div class="info">
              <h4 class="title">${data.snippet.title}</h4>
              <p class="channel-name">${data.snippet.channelTitle}</p>
              <p class="views channel-name">${viewCount} views | ${publishedAt}</p>
          </div>
      </div>
  </div>
  `;
  fetchVideoStats(data.id, "contentDetails");
  videoContainer.addEventListener("click",()=>{
    location.href = `./videoPlayer.html?id=${data.id}`;
    // console.log(data.id);
  })
  body.appendChild(videoContainer);
};

function convertISO8601DurationToReadableTime(duration) {
  // Extract hours, minutes, and seconds from the duration string
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  // If the duration string is invalid, return an empty string or handle the error as needed
  if (!match) {
    return "";
  }

  // Extract hours, minutes, and seconds, defaulting to 0 if not present
  let hours = match[1] ? parseInt(match[1].replace("H", ""), 10) : 0;
  let minutes = match[2] ? parseInt(match[2].replace("M", ""), 10) : 0;
  let seconds = match[3] ? parseInt(match[3].replace("S", ""), 10) : 0;

  // Format hours, minutes, and seconds to two digits
  let formattedHours = hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(seconds).padStart(2, "0");

  // Return the formatted time
  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

function formatViewCount(viewCount) {
  if (viewCount >= 1_000_000_000) {
      return (viewCount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (viewCount >= 1_000_000) {
      return (viewCount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (viewCount >= 1_000) {
      return (viewCount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
      return viewCount.toString();
  }
}
// fetchVideo();
