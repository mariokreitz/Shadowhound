import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import { Toast } from "./class/toast.class";

window.addEventListener("load", function () {
  const canvasID = "canvas1";
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  if (!canvas) {
    const toast = new Toast();
    toast.add(`id: ${canvasID} not found`, 30000);
  }

  const ctx = canvas.getContext("2d");
});
