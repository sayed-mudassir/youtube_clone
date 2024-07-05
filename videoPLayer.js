


let vidId = "Gtjbh1Xuvv8";
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
}
onYouTubeIframeAPIReady(vidId);

async function getComments(vidId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${vidId}&key=${API_KEY}`
    );
    const data = await response.json();
    console.log(data);
    data.items.forEach((item)=>{
      // console.log(item.snippet.topLevelComment.snippet.textDisplay);

      // console.log(item.snippet.topLevelComment.snippet.authorDisplayName);
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
    })
  } catch (e) {
    console.log(e);
  }
}
// getComments("uV50UfcIT68")
// getComments("OFMIJXUYI-E")