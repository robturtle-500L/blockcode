(function (global) {
  "use strict";

  var scriptElem = document.querySelector(".script");
  var title =
    "__" +
    document.querySelector("title").textContent.toLowerCase().replace(" ", "_");

  function saveLocal() {
    var script = scriptToJson();
    if (script) {
      localStorage[title] = script;
    } else {
      delete localStorage[title];
    }
  }

  function scriptToJson() {
    var blocks = [].slice.call(document.querySelectorAll(".script > .block"));
    return blocks.length ? JSON.stringify(blocks.map(Block.script)) : "[]";
  }

  function jsonToScript(json) {
    clearScript();
    JSON.parse(json).forEach((block) => {
      scriptElem.appendChild(Block.create.apply(null, block));
    });
    Menu.runSoon();
  }

  function restoreLocal() {
    jsonToScript(localStorage[title] || "[]");
  }

  function clearScript() {
    [].slice
      .call(document.querySelectorAll(".script > .block"))
      .forEach((block) => block.parentElement.removeChild(block));
    Menu.runSoon();
  }

  function saveFile() {
    var title = prompt("Save file as: ");
    if (!title) {
      return;
    }
    saveFileImpl(title + ".json", scriptToJson());
  }

  function saveFileImpl(filename, contents) {
    var reader = new FileReader();
    reader.onloadend = function () {
      var a = document.createElement("a");
      a.href = reader.result;
      a.download = filename;
      a.click();
    };
    var blob = new Blob([contents], { type: "application/json" });
    reader.readAsDataURL(blob);
  }

  function readFile(file) {
    var fileName = file.name;
    if (fileName.indexOf(".json", fileName.length - 5) === -1) {
      return alert("Not a JSON file");
    }
    var reader = new FileReader();
    reader.onload = (evt) => jsonToScript(evt.target.result);
    reader.readAsText(file);
  }

  function loadFile() {
    var input = elem("input", { type: "file", accept: "application/json" });
    if (!input) {
      return;
    }
    input.addEventListener("change", () => readFile(input.files[0]));
    input.click();
  }

  function loadExample(evt) {
    var exampleName = evt.target.value;
    if (exampleName === "") {
      return;
    }
    clearScript();
    file.examples[exampleName].forEach((block) =>
      scriptElem.appendChild(Block.create.apply(null, block))
    );
    Menu.runSoon();
  }

  global.file = {
    saveLocal: saveLocal,
    restoreLocal: restoreLocal,
    examples: {},
  };

  document
    .querySelector(".clear-action")
    .addEventListener("click", clearScript, false);
  document
    .querySelector(".save-action")
    .addEventListener("click", saveFile, false);
  document
    .querySelector(".load-action")
    .addEventListener("click", loadFile, false);
  document
    .querySelector(".choose-example")
    .addEventListener("change", loadExample, false);
})(window);
