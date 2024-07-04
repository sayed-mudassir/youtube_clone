window.addEventListener("load", () => {
  let vidId = "OFbSqd54Wwk&ab";
  if (YT) {
    console.log("hi");
    new YT.Player("video-player",{
      height: "400",
      width: "700",
      vidId,
    });
  }
});
