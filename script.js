const editor = document.querySelector("#editor");
const optionBtns = document.querySelectorAll(".options__button");
const fontFamilySelect = document.querySelector("#font-family.options__select");
const fontSizeSelect = document.querySelector("#font-size.options__select");
const foreColor = document.querySelector(
  "#fore-color.options__input[type='color']"
);
const backColor = document.querySelector(
  "#back-color.options__input[type='color']"
);

const optionList = {
  bold: {
    tag: "b",
    execCommand: "bold",
    selectionRequired: true,
  },
  italic: {
    tag: "i",
    execCommand: "italic",
    selectionRequired: true,
  },
  underline: {
    tag: "u",
    execCommand: "underline",
    selectionRequired: true,
  },
  strikeThrough: {
    tag: "strike",
    execCommand: "strikeThrough",
    selectionRequired: true,
  },
  subscript: {
    tag: "sub",
    execCommand: "subscript",
    selectionRequired: true,
  },
  superscript: {
    tag: "sup",
    execCommand: "superscript",
    selectionRequired: true,
  },
  undo: {
    execCommand: "undo",
    selectionRequired: false,
  },
  redo: {
    execCommand: "redo",
    selectionRequired: false,
  },
  justifyLeft: {
    execCommand: "justifyLeft",
    selectionRequired: false,
  },
  justifyCenter: {
    execCommand: "justifyCenter",
    selectionRequired: false,
  },
  justifyRight: {
    execCommand: "justifyRight",
    selectionRequired: false,
  },
  justifyFull: {
    execCommand: "justifyFull",
    selectionRequired: false,
  },
  insertUnorderedList: {
    tag: "ul",
    execCommand: "insertUnorderedList",
    selectionRequired: false,
  },
  insertOrderedList: {
    tag: "ol",
    execCommand: "insertOrderedList",
    selectionRequired: false,
  },
  indent: {
    execCommand: "indent",
    selectionRequired: false,
  },
  outdent: {
    execCommand: "outdent",
    selectionRequired: false,
  },
  insertImage: {
    execCommand: "insertImage",
    selectionRequired: false,
  },
  insertVideo: {
    execCommand: "insertVideo",
    selectionRequired: false,
  },
  createLink: {
    tag: "a",
    execCommand: "createLink",
    selectionRequired: false,
  },
  insertText: {
    execCommand: "insertText",
    selectionRequired: false,
  },
};

const fontFamilyList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

const fontSizeList = [
  {
    value: 1,
    type: "Heading 6",
  },
  {
    value: 2,
    type: "Heading 5",
  },
  {
    value: 3,
    type: "Paragraf (H4)",
  },
  {
    value: 4,
    type: "Heading 3",
  },
  {
    value: 5,
    type: "Heading 2",
  },
  {
    value: 6,
    type: "Heading 1",
  },
  {
    value: 7,
    type: "Heading 0 (Mega)",
  },
];

fontFamilyList.forEach((fontFamily) => {
  var optionElement = document.createElement("option");
  optionElement.value = fontFamily;
  optionElement.text = fontFamily;
  fontFamilySelect.add(optionElement);
});

fontSizeList.forEach((fontSize) => {
  var optionElement = document.createElement("option");
  optionElement.text = fontSize.type;
  optionElement.value = fontSize.value;
  fontSizeSelect.add(optionElement);
});

function getActiveTags() {
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  let currentNode = range ? range.commonAncestorContainer : null;

  let activeTags = [];
  let alignmentCommand = "justifyLeft"; // Varsayılan olarak sola hizalı

  const isListTag = (tag) => ["ol", "ul"].includes(tag);
  const isListButton = (button) =>
    ["insertUnorderedList", "insertOrderedList"].includes(button);

  const addTag = (buttonId) => {
    if (!activeTags.includes(buttonId)) {
      activeTags.push(buttonId);
    }
  };

  while (currentNode) {
    if (currentNode instanceof Element) {
      const selectedTag = currentNode.nodeName.toLowerCase();
      const computedDivAlignment =
        window.getComputedStyle(currentNode).textAlign;

      switch (computedDivAlignment) {
        case "left":
          alignmentCommand = "justifyLeft";
          break;
        case "center":
          alignmentCommand = "justifyCenter";
          break;
        case "right":
          alignmentCommand = "justifyRight";
          break;
        case "justify":
          alignmentCommand = "justifyFull";
          break;
      }

      if (isListTag(selectedTag) && activeTags.some(isListButton)) {
        // Ol ve ul tag'ları durumunda ve activeTags içinde ilgili elemanlar zaten varsa, ekleme yapma
      } else {
        optionBtns.forEach((optionBtn) => {
          if (
            optionList[optionBtn.id] &&
            optionList[optionBtn.id].tag === selectedTag
          ) {
            addTag(optionBtn.id);
          }
        });
      }

      if (currentNode.nodeName.toLowerCase() === "font") {
        const fontFace = currentNode.getAttribute("face");
        const fontSize = currentNode.getAttribute("size");
        const color = currentNode.getAttribute("color");

        if (fontFace) {
          const fontFamilyOptions = document.querySelectorAll(
            "#font-family.options__select option"
          );
          const index = Array.from(fontFamilyOptions).findIndex(
            (option) => option.value === fontFace
          );
          if (index !== -1) {
            fontFamilySelect.selectedIndex = index;
          }
          addTag("fontFamily");
        }

        if (fontSize) {
          const fontSizeOptions = document.querySelectorAll(
            "#font-size.options__select option"
          );
          const index = Array.from(fontSizeOptions).findIndex(
            (option) => option.value === fontSize
          );
          if (index !== -1) {
            fontSizeSelect.selectedIndex = index;
          }
          addTag("fontSize");
        }

        if (color) {
          foreColor.value = color;
          addTag("foreColor");
        }
      }

      const backgroundColor =
        window.getComputedStyle(currentNode).backgroundColor;
      if (
        backgroundColor !== "rgba(0, 0, 0, 0)" &&
        backgroundColor !== "transparent"
      ) {
        backColor.value = rgbaToHex(backgroundColor);
        addTag("backColor");
      }

      execCommand("enableObjectResizing");
    }

    currentNode = currentNode.parentNode;

    if (currentNode && currentNode.id && currentNode.id == "editor") {
      break;
    }
  }

  if (!activeTags.includes("fontFamily")) {
    fontFamilySelect.selectedIndex = 0;
  }

  if (!activeTags.includes("fontSize")) {
    fontSizeSelect.selectedIndex = 2;
  }

  if (!activeTags.includes("foreColor")) {
    foreColor.value = "#000000";
  }

  if (!activeTags.includes("backColor")) {
    backColor.value = "#000000";
  }

  if (
    alignmentCommand &&
    !activeTags.some((tag) => tag.startsWith("justify"))
  ) {
    addTag(alignmentCommand);
  }

  return activeTags;
}

function rgbaToHex(rgba) {
  // 'rgba(255, 0, 0, 1)' formatındaki rgba değerini alın
  const values = rgba.match(/\d+/g);

  // Red, green, blue değerlerini alın
  const red = parseInt(values[0]);
  const green = parseInt(values[1]);
  const blue = parseInt(values[2]);

  // RGB değerlerini birleştirip hex renk kodunu oluşturun
  const hex = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  return hex;
}

function updateButtonState() {
  const activeTags = getActiveTags();
  optionBtns.forEach((optionBtn) => {
    optionBtn.classList.toggle("active", activeTags.includes(optionBtn.id));
  });
}

function handleButtonClick(optionBtn) {
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const selectionText = selection.toString();
  const option = optionList[optionBtn.id];

  let command;
  let value;

  if (option.execCommand === "createLink") {
    if (selectionText === "") {
      const text = prompt("Enter the text:");
      const url = prompt("Enter the URL:", "http://");
      let link = document.createElement("a");
      link.textContent = text;
      link.href = url;
      range.insertNode(link);
    } else {
      const url = prompt("Enter the URL:", "http://");
      if (url) {
        command = option.execCommand;
        value = url;
      }
    }
  } else if (option.execCommand === "insertImage") {
    const url = prompt("Enter the URL:", "");

    if (url) {
      command = option.execCommand;
      value = url;
    }
  } else if (option.execCommand === "insertVideo") {
    const url = prompt("Enter the URL:", "");

    if (url) {
      const videoElement = document.createElement("video");
      videoElement.controls = true;
      const sourceElement = document.createElement("source");
      sourceElement.src = url;
      sourceElement.type = "video/mp4";

      videoElement.appendChild(sourceElement);

      range.insertNode(videoElement);
    }
  } else if (option.execCommand === "insertText") {
    command = option.execCommand;
    value = "😀";
  } else {
    if (
      !option.selectionRequired ||
      (option.selectionRequired && selectionText !== "")
    ) {
      command = option.execCommand;
    }
  }

  execCommand(command, value);
  updateButtonState();

  editor.focus();
}

function execCommand(command, value = null) {
  document.execCommand(command, false, value);
}

editor.addEventListener("mouseup", updateButtonState);

editor.addEventListener("keydown", (event) => {
  var isShiftPressed = event.shiftKey;
  var isCtrlPressed = event.ctrlKey || event.metaKey;

  if (isShiftPressed && event.key === "Tab") {
    execCommand("outdent");
    event.preventDefault();
  } else if (event.key === "Tab") {
    execCommand("indent");
    event.preventDefault();
  } else if (isCtrlPressed && event.key === "B") {
    execCommand("bold");
  } else if (isCtrlPressed && (event.key === "I" || event.key === "i")) {
    execCommand("italic");
  } else if (isCtrlPressed && event.key === "U") {
    execCommand("underline");
  }

  updateButtonState();
});

optionBtns.forEach((optionBtn) => {
  optionBtn.addEventListener("click", () => handleButtonClick(optionBtn));
});

fontFamilySelect.addEventListener("change", (e) => {
  execCommand("fontName", e.target.value);
});

fontSizeSelect.addEventListener("change", (e) => {
  execCommand("fontSize", e.target.value);
});

foreColor.addEventListener("input", (e) => {
  execCommand("foreColor", e.target.value);
});

backColor.addEventListener("input", (e) => {
  execCommand("backColor", e.target.value);
});
