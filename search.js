const BASE_URL = "https://plm-portal.ema.europa.eu"; // Base URL for the EMA API
const PATHS = {
    EPI_PUBLIC: "/get-epipublic/?page=1",
    EPI_PUBLIC_DETAILS: "/get-epipublicdetails/",
    EPI_PUBLIC_LANG: "/get-epipubliclang/"
}

function getCORSErrorFreeURL(url) {
    return 'https://corsproxy.io/?' + encodeURIComponent(url);
}

async function getEPIPublic() {
    let url = getCORSErrorFreeURL(BASE_URL + PATHS.EPI_PUBLIC);
    let response = await fetch(url);
    let data = await response.json();
    return data.results.data;
}

function getEpiIdForName(epiRecords, nameOfMedicinalProduct) {
    const encodedName = encodeURIComponent(nameOfMedicinalProduct);
    const epiRecord = epiRecords.find(record => record.epiname.includes(encodedName));
    if (!epiRecord) {
        throw new Error("No EPI record found for the given name.");
    }
    return epiRecord.epiid;
}

async function getPublicLang(epiId) {
    let url = getCORSErrorFreeURL(BASE_URL + PATHS.EPI_PUBLIC_LANG + `?epiid=${epiId}`);
    let response = await fetch(url);
    let data = await response.json();
    return data.results[0].epilangid;
}

async function getPublicDetails(epiId, epiLangId) {
    let url = getCORSErrorFreeURL(BASE_URL + PATHS.EPI_PUBLIC_DETAILS + `?epiid=${epiId}&lanid=${epiLangId}`);
    let response = await fetch(url);
    let data = await response.json();
    return data.results;
}

function getLeafletForEpiId(publicDetails, epiId) {
    //find all records with the same epiId and return only the
    let leafletSections = publicDetails.filter(record => record.qrddocname === "PL" && record.ispublishing === "true");
    leafletSections = leafletSections.map(record => {
        return {
            title: decodeURIComponent(record.sectionname),
            body: decodeURIComponent(record.sectionbody)
        }
    })

    //combine all sections into one html
    let html = "";
    leafletSections.forEach(section => {
        html += `<h1>${section.title}</h1>`;
        html += section.body;
    })

    return html;
}

async function searchProduct() {
    let title = document.getElementById("productTitle").value;
    if (title) {
        try {
            const epiPublic = await getEPIPublic();
            const epiId = getEpiIdForName(epiPublic, title);
            const epiLangId = await getPublicLang(epiId);
            const epiPublicDetails = await getPublicDetails(epiId, epiLangId);
            const leaflet = getLeafletForEpiId(epiPublicDetails, epiId);
            document.getElementById("results").innerHTML = leaflet;
        } catch (e) {
            document.getElementById("results").innerHTML = "No leaflet found for this product.";
        }
    } else {
        document.getElementById("results").innerHTML = "Please enter a product title.";
    }
}
