import {setTextDirectionForLanguage, updateFontZoom} from "../../../utils.js"

import environment from "../../../environment.js";
import constants from "../../../constants.js";
import {getFileContent, getFileContentAsBuffer, getImageAsBase64, renderLeaflet} from "../utils/leafletUtils.js";

let uploadedFiles = [];
const devices = [
  {resolution: "320x568", deviceName: 'iPhone SE'},
  {resolution: "339x697", deviceName: 'Samsung Galaxy Xcover 5'},
  {resolution: "360x740", deviceName: 'Samsung Note 9'},
  {resolution: "360x760", deviceName: 'Samsung Galaxy S10'},
  {resolution: "360x771", deviceName: 'Huawei P30 Lite'},
  {resolution: "360x780", deviceName: 'Huawei P40'},
  {resolution: "360x800", deviceName: 'Samsung Galaxy S20'},
  {resolution: "360x840", deviceName: 'Sony Xperia 5'},
  {resolution: "360x880", deviceName: 'Samsung Galaxy Z Flip4'},
  {resolution: "375x667", deviceName: 'iPhone 8'},
  {resolution: "375x812", deviceName: 'iPhone 11 Pro'},
  {resolution: "384x824", deviceName: 'Samsung Galaxy S23 Ultra'},
  {resolution: "384x832", deviceName: 'Samsung Galaxy A54'},
  {resolution: "384x854", deviceName: 'Samsung S21 Ultra 5G'},
  {resolution: "385x811", deviceName: 'Nokia 4.2'},
  {resolution: "385x824", deviceName: 'Samsung Galaxy S22 Ultra 5G'},
  {resolution: "385x854", deviceName: 'Samsung Galaxy S20 Plus'},
  {resolution: "385x857", deviceName: 'Samsung Galaxy A13'},
  {resolution: "390x844", deviceName: 'iPhone 12'},
  {resolution: "393x786", deviceName: 'Google Pixel 3'},
  {resolution: "393x808", deviceName: 'Google Pixel 3a'},
  {resolution: "393x830", deviceName: 'Google Pixel 4'},
  {resolution: "393x851", deviceName: 'Google Pixel 4a'},
  {resolution: "393x852", deviceName: 'iPhone 15 Pro'},
  {resolution: "393x873", deviceName: 'Vivo Y70'},
  {resolution: "412x823", deviceName: 'Google Pixel 2 XL'},
  {resolution: "412x846", deviceName: 'Samsung Galaxy Note 9'},
  {resolution: "412x869", deviceName: 'Samsung Galaxy Note 10+'},
  {resolution: "412x892", deviceName: 'OnePlus 7'},
  {resolution: "412x914", deviceName: 'OnePlus 8T'},
  {resolution: "412x915", deviceName: 'OnePlus Nord'},
  {resolution: "412x960", deviceName: 'Motorola Moto G 5G Plus'},
  {resolution: "414x736", deviceName: 'iPhone 6S Plus'},
  {resolution: "432x784", deviceName: 'HTC Desire 20 Pro'},
  {resolution: "414x896", deviceName: 'iPhone 11'},
  {resolution: "428x926", deviceName: 'iPhone 12 Pro Max'},
  {resolution: "430x932", deviceName: 'iPhone 14 Pro Max'},
  {resolution: "448x998", deviceName: 'Google Pixel 8 Pro'},
  {resolution: "601x1007", deviceName: 'Samsung Galaxy Tab A7 Lite'},
  {resolution: "691x829", deviceName: 'Samsung Galaxy Z Fold4 5G'},
  {resolution: "744x1133", deviceName: 'iPad mini 2021'},
  {resolution: "753x1205", deviceName: 'Samsung Galaxy Tab S8'},
  {resolution: "768x1024", deviceName: 'iPad mini 4'},
  {resolution: "800x1280", deviceName: 'Samsung Galaxy Tab A8 10.5'},
  {resolution: "800x1334", deviceName: 'Samsung Galaxy Tab S6 Lite'},
  {resolution: "810x1080", deviceName: 'iPad 10.2'},
  {resolution: "820x1180", deviceName: 'iPad 10.9 '},
  {resolution: "825x1318", deviceName: 'Samsung Galaxy Tab S8+'},
  {resolution: "834x1112", deviceName: 'iPad Pro 10.5'},
  {resolution: "834x1194", deviceName: 'iPad Pro 11'},
  {resolution: "924x1480", deviceName: 'Samsung Galaxy Tab S8 Ultra'},
  {resolution: "1024x1366", deviceName: 'iPad Pro 12.9 '},
  {resolution: "1138x712", deviceName: 'Samsung Galaxy Tab S5e'},
  {resolution: "1205x753", deviceName: 'Samsung Galaxy Tab S7'}
]

const languages = [
  {"code": "ar", "name": "Arabic", "nativeName": "العربية"},
  {"code": "bg", "name": "Bulgarian", "nativeName": "Български език"},
  {"code": "zh", "name": "Chinese", "nativeName": "中文 (Zhōngwén), 汉语, 漢語"},
  {"code": "hr", "name": "Croatian", "nativeName": "hrvatski"},
  {"code": "cs", "name": "Czech", "nativeName": "Česky, čeština"},
  {"code": "da", "name": "Danish", "nativeName": "Dansk"},
  {"code": "nl", "name": "Dutch", "nativeName": "Nederlands, Vlaams"},
  {"code": "en", "name": "English", "nativeName": "English"},
  {"code": "et", "name": "Estonian", "nativeName": "Eesti, eesti keel"},
  {"code": "fi", "name": "Finnish", "nativeName": "Suomi, suomen kieli"},
  {"code": "fr", "name": "French", "nativeName": "Français"},
  {"code": "ka", "name": "Georgian", "nativeName": "ქართული"},
  {"code": "de", "name": "German", "nativeName": "Deutsch"},
  {"code": "el", "name": "Greek, Modern", "nativeName": "Ελληνικά"},
  {"code": "he", "name": "Hebrew (modern)", "nativeName": "עברית"},
  {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी, हिंदी"},
  {"code": "hu", "name": "Hungarian", "nativeName": "Magyar"},
  {"code": "id", "name": "Indonesian", "nativeName": "Bahasa Indonesia"},
  {"code": "it", "name": "Italian", "nativeName": "Italiano"},
  {"code": "ja", "name": "Japanese", "nativeName": "日本語 (にほんご／にっぽんご)"},
  {"code": "ko", "name": "Korean", "nativeName": "한국어 (韓國語), 조선말 (朝鮮語)"},
  {"code": "lt", "name": "Lithuanian", "nativeName": "Lietuvių kalba"},
  {"code": "lv", "name": "Latvian", "nativeName": "Latviešu valoda"},
  {"code": "mk", "name": "Macedonian", "nativeName": "Македонски јазик"},
  {"code": "no", "name": "Norwegian", "nativeName": "Norsk"},
  {"code": "pa", "name": "Panjabi, Punjabi", "nativeName": "ਪੰਜਾਬੀ, پنجابی‎"},
  {"code": "pl", "name": "Polish", "nativeName": "Polski"},
  {"code": "pt", "name": "Portuguese", "nativeName": "Português"},
  {"code": "pt-br", "name": "Portuguese (Brasil)", "nativeName": "Português (Brasil)"},
  {"code": "ro", "name": "Romanian", "nativeName": "Română"},
  {"code": "ru", "name": "Russian", "nativeName": "Русский язык"},
  {"code": "sr", "name": "Serbian", "nativeName": "Српски језик"},
  {"code": "sk", "name": "Slovak", "nativeName": "Slovenčina"},
  {"code": "es", "name": "Spanish; Castilian", "nativeName": "Español, Castellano"},
  {"code": "sv", "name": "Swedish", "nativeName": "Svenska"},
  {"code": "th", "name": "Thai", "nativeName": "ไทย"},
  {"code": "tr", "name": "Turkish", "nativeName": "Türkçe"},
  {"code": "uk", "name": "Ukrainian", "nativeName": "Українська"},
  {"code": "vi", "name": "Vietnamese", "nativeName": "Tiếng Việt"}
];

function LeafletPreviewController() {

  function getViewPortData() {
    const selectedSize = document.getElementById('viewportSelector').value.split('x');
    const viewPortOrientation = document.querySelector('.orientation-img.selected');
    if (viewPortOrientation.classList.contains("portrait")) {
      return {width: selectedSize[0], height: selectedSize[1]}
    }
    if (viewPortOrientation.classList.contains("landscape")) {
      return {height: selectedSize[0], width: selectedSize[1]}
    }
  }

  function changeViewport() {
    // Get the selected viewport size
    const {width, height} = getViewPortData();

    let selectedLang = document.querySelector("#leafletLanguage").value;
    setTextDirectionForLanguage(selectedLang, "#leaflet-content");
    setTextDirectionForLanguage(selectedLang, "#settings-modal .page-header")

    // Set the viewport size dynamically within the iframe
    const previewContainer = document.querySelector('#settings-modal');
    previewContainer.style.width = `${width}px`;
    previewContainer.style.height = `${height}px`;
    //(document.querySelector(".leaflet-preview-container").getBoundingClientRect().height - height) / 2 + "px";
  }

  function toggleOrientation(event) {
    if (event.target.classList.contains("selected")) {
      return;
    }
    document.querySelectorAll(".orientation-img").forEach(item => {
      item.classList.toggle("selected")
    });
    changeViewport();
  }

  function changeZoom(event) {
    updateFontZoom(event.target.value, true);
  }

  this.uploadFilesInput = document.querySelector("input[type='file']");
  this.uploadFilesBtn = document.querySelector(".upload-files-btn");
  this.changeViewport = document.querySelector("#viewportSelector");
  this.changeZoom = document.querySelector("#zoomSelector");
  this.changeLang = document.querySelector("#leafletLanguage");
  this.portraitBtn = document.querySelector(".orientation-img.portrait");
  this.landscapeBtn = document.querySelector(".orientation-img.landscape");
  this.portraitBtn.addEventListener("click", toggleOrientation)
  this.landscapeBtn.addEventListener("click", toggleOrientation)

  // this.changeOrientation = document.querySelector("#viewportOrientation");

  this.changeViewport.addEventListener("change", changeViewport);
  this.changeZoom.addEventListener("change", changeZoom);
  this.changeLang.addEventListener("change", changeViewport);
  // this.changeOrientation.addEventListener("change", changeViewport);

  this.uploadFilesBtn.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    this.uploadFilesInput.value = '';
    this.uploadFilesInput.click();
  });

  const dialog = document.querySelector("dialog");
  const closeButton = document.querySelector("dialog button");
  closeButton.addEventListener("click", () => {
    dialog.close();
  })

  async function renderLeafletView(files) {
    let {xmlContent, leafletImages} = await renderFileList(files);
    let leafletData = {
      productData: {
        name: document.querySelector(".product-name-container input").value || "Unset Brand/invented name",
        description: document.querySelector(".product-description-container textarea").value || "Unset Name of Medicinal Product",
      },
      leafletImages,
      xmlContent
    }
    try {
      renderLeaflet(leafletData);
      document.querySelector('#settings-modal').classList.remove("hiddenElement");
    } catch (e) {
      dialog.querySelector(".dialog-text").innerHTML = e.message
      dialog.showModal();
    }

    changeViewport();
  }

  /*  async function updateFileList(event) {
      let fileToRemove = event.currentTarget.getAttribute("fileName");
      uploadedFiles = uploadedFiles.filter(item => {
        if (item.name !== fileToRemove) {
          return item;
        }
      });
      await renderLeafletView(uploadedFiles);
    }*/

  async function renderFileList(files) {
    let xmlContent;
    let leafletImages = {};
    let fileListElement = document.querySelector(".files-list");
    fileListElement.innerHTML = "";
    for (let file of files) {
      let divElement = document.createElement("div");
      divElement.classList.add("file-li-element");
      divElement.innerHTML = `<p>${file.name}</p>`
      fileListElement.append(divElement);
      // divElement.querySelector(".delete-file-btn").addEventListener("click", updateFileList);
      if (file.name.endsWith('.xml')) {
        xmlContent = await getFileContent(file);
      } else {
        let fileContent = await getFileContentAsBuffer(file);
        leafletImages[file.name] = getImageAsBase64(fileContent);
      }
    }
    return {xmlContent, leafletImages}
  }


  this.uploadFileHandler = async (event) => {
    document.querySelector('#settings-modal').classList.add("hiddenElement");
    let files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    //files = [...uploadedFiles, ...files]

    uploadedFiles = files;
    await renderLeafletView(uploadedFiles);
    this.uploadFilesBtn.querySelector("span").innerText = "Reset and Upload Leaflet Files";
  }

  this.uploadFilesInput.addEventListener('change', this.uploadFileHandler);
}


const uploadController = new LeafletPreviewController();

window.onload = async (event) => {
  //set device select options
  let options = '';
  devices.forEach(device => {
    options = options + `<option value=${device.resolution}>${device.deviceName} (${device.resolution})</option>`
  })
  document.querySelector('#viewportSelector').innerHTML = options;

  //set la select options
  let langOptions = '';
  languages.forEach(lang => {
    langOptions = langOptions + `<option value=${lang.code} ${lang.code === "en" ? "selected" : ""}>${lang.name}</option>`
  })
  document.querySelector('#leafletLanguage').innerHTML = langOptions;

  document.querySelector(".page-container").classList.remove("hiddenElement");
  document.querySelector(".loader-container").setAttribute('style', 'display:none');
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let epiDomain = urlParams.get("setdomain") || localStorage.getItem(constants.EPI_DOMAIN) || environment.epiDomain;
localStorage.setItem(constants.EPI_DOMAIN, epiDomain);


window.uploadController = uploadController;

