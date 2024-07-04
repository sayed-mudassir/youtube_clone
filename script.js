const BASE_URL = "https://www.googleapis.com/youtube/v3";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const body = document.getElementById("body");

const API_KEY = "AIzaSyCu4znECfXCutH07IzgcdbEFoSyzUqkpG0";

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
// searchVideos("a", 1, "snippet");

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
      likeCount : formatViewCount(data.items[0].statistics.likeCount)
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
async function getComments(vidId) {
  try {
    const response = await fetch(
      BASE_URL +
        "/comments" +
        `?key=${API_KEY}
          &videoId=${vidId}
          &part=snippet`
    );
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
// getComments("OFMIJXUYI-E")
// getComments("uV50UfcIT68")

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
      getChannelIcon(item);
    });
  } catch (e) {
    console.log(e);
  }
}
async function getChannelIcon(video_data) {
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
    makeVideoCard(video_data, duration,Count.viewCount,Count.likeCount);
  } catch (e) {
    console.log(e);
  }
}

const makeVideoCard = (data, duration, viewCount,likeCount) => {
  const videoContainer = document.createElement("div");
  videoContainer.innerHTML = `
  <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
      <div class="faic">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="time faic">${duration}</div>
      </div>
      <div class="content">
          <img src="${data.channelThumbnail}" class="channel-icon" alt="">
          <div class="info">
              <h4 class="title">${data.snippet.title}</h4>
              <p class="channel-name">${data.snippet.channelTitle}</p>
              <p class="views channel-name">${viewCount} views | ${likeCount} likes</p>
          </div>
      </div>
  </div>
  `;
  fetchVideoStats(data.id, "contentDetails");
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

fetchVideo();
