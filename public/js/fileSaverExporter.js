
document.querySelector('.closeBtn').addEventListener('click', () => {modal.classList.toggle('displayNone')});

// Creating XLSX file
const deleteUnnecessary = data => {
  for (let i = 0; i < data.length; i++) {
    data[i].date = new Date(data[i].date).toLocaleDateString();
    delete data[i]._id;
    delete data[i].id;
    delete data[i].__v;
    delete data[i].wine._id;
    delete data[i].wine.id;
    delete data[i].wine.__v;
  }
};
const createWSData = data => {
  let extern = [];
  let intern = [];
  let i = 0;
  for (el of data) {
    el["wine"] = el["wine"].name;
    el["person"] = el["person"].name;
    intern = Object.values(el);
    extern[i++] = intern;
  }
  return extern;
};
const convert = async () => {
  const res = await axios({
    method: "GET",
    url: url + "serie"
  });

  let { data } = res.data;

  deleteUnnecessary(data);
  data = createWSData(data);
  console.log(data);

  const wb = XLSX.utils.book_new();
//   wb.Props = {
//     Vino: "Vino",
//     Quantità: "Quantità (bottiglie)",
//     Destinazione: "Destinazione"
//   };
  wb.SheetNames.push("Prelievo");

  const ws_data = data;
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Prelievo"] = ws;

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const s2ab = s => {
    const buffer = new ArrayBuffer(s.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buffer;
  };

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "cantina.xlsx"
  );
};

document.querySelector(".btn-convert").addEventListener("click", () => {convert()});
