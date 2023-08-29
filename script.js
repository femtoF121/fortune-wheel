const options = [
  { title: "100$" },
  { title: "50$" },
  { title: "0$" },
  { title: "10$" },
  { title: "present" },
  { title: "0$" },
  { title: "1000$" },
  { title: "75$" },
];

let optionId = 1;
const wheel = document.querySelector(".wheel");
const ctx = wheel.getContext("2d");
const rad = ctx.canvas.width / 2;
const PI = Math.PI;
const getIndex = () =>
  Math.floor(options.length - (ang / TAU) * options.length) % options.length;

function drawSector(option, i, arc) {
  ang = arc * i;
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = i % 2 !== 0 ? "#9D4343" : "rgb(86, 86, 86)";
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.fill();

  ctx.translate(rad, rad);
  ctx.rotate(PI / 2 + ang + arc / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.font = "40px sans-serif";
  if (options.length <= 1) ctx.rotate(PI);
  ctx.fillText(option.title, 0, 75 - rad);

  ctx.restore();
}

function drawDecorations() {
  ctx.beginPath();
  ctx.arc(rad, rad, 18, 0, 2 * PI);
  ctx.fillStyle = "#9D4343";
  ctx.fill();
  ctx.lineWidth = 11;
  ctx.strokeStyle = "#1f1e1e";
  ctx.stroke();

  const ctx2 = document.querySelector(".wheel-arrow").getContext("2d");
  const mdl = ctx2.canvas.width / 2;
  const mrg = 5;
  ctx2.beginPath();
  ctx2.fillStyle = "black";
  ctx2.moveTo(mdl, 40);
  ctx2.lineTo(0, 0);
  ctx2.lineTo(mdl * 2, 0);
  ctx2.fill();
  ctx2.beginPath();
  ctx2.fillStyle = "#9D4343";
  ctx2.moveTo(mdl, 40 - mrg * 2);
  ctx2.lineTo(0 + mrg * 2, 0 + mrg);
  ctx2.lineTo(mdl * 2 - mrg * 2, 0 + mrg);
  ctx2.fill();
}

function drawWheel() {
  if (options.length == 0) {
    drawSector({ title: "Add option" }, 0, 2 * PI);
    drawDecorations();
    return;
  }
  let arc = (2 * PI) / options.length;
  for (let i = 0; i < options.length; i++) {
    drawSector(options[i], i, arc);
  }
  drawDecorations();
  ctx.canvas.style.transform = `rotate(${-PI / 2}rad)`;
}

function spin() {
  const rnd = Math.random() * 360;
  let winner = getWinner(rnd);
  const btn = document.querySelectorAll(".input-btn, button");
  console.log(btn);
  btn.forEach((el) => (el.disabled = true));
  wheel.style.transition = "all 7s cubic-bezier(.21,-0.3,0,1)";
  wheel.style.transform = `rotate(-${1800 + rnd}deg)`;
  setTimeout(() => {
    wheel.style.transition = "none";
    wheel.style.transform = `rotate(-${rnd}deg)`;
    btn.forEach((el) => (el.disabled = false));
    document.querySelector("#prevPrize").innerHTML = options[winner].title;
    //setTimeout(() => alert("Your prize is: " + options[winner].title), 100);
  }, 7000);
}

function getWinner(rnd) {
  let radRnd = (((rnd + 270) % 360) * PI) / 180;
  let radPerOp = (2 * PI) / options.length;
  let winner = radRnd / radPerOp;
  return Math.floor(winner);
}

function addOption(option) {
  const ul = document.querySelector(".options");
  let li = document.createElement("li");
  li.id = option.id;
  let div = document.createElement("div");
  div.classList.add("text-card");
  div.textContent = option.title;
  let btn = document.createElement("button");
  btn.textContent = "X";
  btn.setAttribute("onclick", "removeOption(event)");
  li.appendChild(div);
  li.appendChild(btn);
  ul.appendChild(li);
}

function renderOptions() {
  for (let i = 0; i < options.length; i++) {
    options[i].id = optionId++;
    addOption(options[i]);
  }
}

function addEmptyOption() {
  const ul = document.querySelector(".options");
  let li = document.createElement("li");
  let input = document.createElement("input");
  input.type = "text";
  input.classList.add("text-card");
  li.appendChild(input);
  ul.appendChild(li);
  input.focus();
  input.addEventListener("focusout", (event) => {
    let op = { title: event.target.value, id: optionId++ };
    options.push(op);
    li.remove();
    addOption(op);
    drawWheel();
  });
}

function removeOption(e) {
  for (let i = 0; i < options.length; i++) {
    if (e.target.parentNode.id == options[i].id) {
      options.splice(i, 1);
      e.target.parentNode.remove();
      drawWheel();
      break;
    }
  }
}

function init() {
  drawWheel();
  renderOptions();
}
