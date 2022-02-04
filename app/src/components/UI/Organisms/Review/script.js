
const styleComments = () => {
  var comments = document.querySelectorAll(".commentWrap")
  for (let i = 0; i < comments.length; i++) {
    let sum = 22 + (22 * i)
    comments[i].style.paddingLeft = sum + 'px'
  }
}

export default styleComments