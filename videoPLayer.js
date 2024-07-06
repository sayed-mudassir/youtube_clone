
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const vidId = getQueryParam('id');

function onYouTubeIframeAPIReady(vidId) {
  window.addEventListener("load", () => {
    if (YT) {
      console.log("hi");
      new YT.Player("player", {
        videoId: vidId,
        playerVars: {
          playsinline: 1,
        },
      });
    }
  });
  getVideo(vidId);
}
onYouTubeIframeAPIReady(vidId);

async function getComments(vidId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${vidId}&key=${API_KEY}`
    );
    const data = await response.json();
    console.log(data.items[0].snippet.channelId);
    data.items.forEach((item)=>{
      fetchComments(item);
    })
  } catch (e) {
    console.log(e);
  }
}

async function fetchVideoStat(id, typeOfDetails) {
  try {
    const response = await fetch(
      BASE_URL +
        "/videos" +
        `?key=${API_KEY}
        &part=${typeOfDetails}
        &id=${id}`
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

async function getVideo(vId) {
  // body.innerHTML = ``;
  try {
    const response = await fetch(
      video_http +
        new URLSearchParams({
          key: API_KEY,
          part: "snippet",
          id:vidId,
          regionCode: "IN",
        })
    );
    const data = await response.json();
    console.log(data)
    const videoTitle = data.items[0].snippet.title;
    const videoDescription = data.items[0].snippet.description;
    const channelId = data.items[0].snippet.channelId;
    const Count = await fetchVideoStat(vId,"statistics");
    const time = timeAgo(data.items[0].snippet.publishedAt);
    makeVideoDesciption(videoDescription,Count.fullViewCount,time);
    getChannel(channelId,videoTitle,Count.likeCount);
    getComments(vId);
  } catch (e) {
    console.log(e);
  }
}
function fetchComments(item){
  const commentBody = document.getElementById("comments-conatiner")
      const comments = document.createElement("div");
      comments.className = "comments";
      comments.innerHTML = ` <div class="comments">
        <div><img src="${item.snippet.topLevelComment.snippet.authorProfileImageUrl
        }" alt="profile" /></div>
        <div>
          <p><b>${item.snippet.topLevelComment.snippet.authorDisplayName}</b></p>
          <p>
            ${item.snippet.topLevelComment.snippet.textDisplay}
          </p>
          <span class="material-symbols-outlined">
            thumb_up
            </span>${formatViewCount(item.snippet.topLevelComment.snippet.likeCount)}
            <span class="material-symbols-outlined">
                thumb_down
                </span>
        </div>`
        commentBody.appendChild(comments)
}

async function getChannel(channelId,title,likeCount) {
  try {
    const response = await fetch(
      channel_http +
        new URLSearchParams({
          key: API_KEY,
          part: "snippet",
          id: channelId,
        })
    );
    const data = await response.json();
    const channelName = data.items[0].snippet.title;
    const channelLogo = data.items[0].snippet.thumbnails.default.url;
    const videoDescription = title;
    makeChannelDetail(videoDescription,channelLogo,channelName,"NA",likeCount);

  } catch (e) {
    console.log(e);
  }
}
function makeChannelDetail(channelDescription,channelLogo,channelName,suscriberCount,likeCount){
  const channel = document.getElementById("channel-detail")
  const des = document.createElement("div");
  des.className = "video-description";
  des.innerHTML = `
        <div class="video-description">
          <h3>
          ${channelDescription}
            </h3>
        </div>
        <div class="youtuber-details">
          <div class="channelLogo">
            <img src="${channelLogo}" alt="" />
            <div>
              <p class="youtuber-name"><b>${channelName}</b></p>
              <p class="subscriber-count">${suscriberCount}</p>
            </div>
            <button class="subscribe">subscribe</button>
          </div>
          <div class="action-buttons">
            <div class="like-dislike">
            <span><b>${likeCount}</b></span>
              <button id="like" class="material-symbols-outlined">thumb_up</button>
            <button class="material-symbols-outlined dislike">thumb_down</button>
            </div>
            <button class="material-symbols-outlined">share</button>
            <button class="material-symbols-outlined">save</button>
            <button class="material-symbols-outlined">cut</button>
            <button class="material-symbols-outlined">more</button>
          </div>
        </div>`
        channel.innerHTML=``;
        channel.appendChild(des)
}

function makeVideoDesciption(videoDescription,viewsCount,date){
  const description = document.getElementById("description")
  const descriptionBody = document.createElement("div")
  descriptionBody.innerHTML = `<p><b>
          ${viewsCount} views ${date}</b></p>
        <pre>${videoDescription}</pre>`;
        description.appendChild(descriptionBody);
        console.log("description added");
}

function timeAgo(releaseDate) {
  const now = new Date();
  const releaseTime = new Date(releaseDate);

  const seconds = Math.floor((now - releaseTime) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
      return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

const releaseDate = '2023-11-29T10:54:08Z';
console.log(timeAgo(releaseDate)); // Output: e.g., "1 month ago"

// getChannel("UCZSNzBgFub_WWil6TOTYwAg")
// getComments("uV50UfcIT68")
// getComments("OFMIJXUYI-E")
getVideo("uV50UfcIT68");
