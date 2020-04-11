let url = 'http://127.0.0.1:5000/';
const style = 'color: red; font-weight: bold; font-size: 12px;';

// Creating the serie
const createSerie = async data => {
  const token = localStorage.getItem('token');

  const {wine, qty, person, purpose, comment, destinationStr} = data;

  try {
    await axios({
      method: "POST",
      url: url + "serie",
      headers: {
        Authorization: token,
      },
      data: {
        wine,
        qty,
        person,
        purpose,
        comment,
        destinationStr
      }
    });
    window.location.href = url;
  } catch (error) {
    console.log('%c CREATE SERIE', style, error);
  }
};

const getWine = async name => {
  try {
    const {data} = await axios({
      method: "GET",
      url: url + `wine/${name}`
    });
    const {_id} = data.data;
    return _id;
  } catch (error) {
    console.log('%c WINE: ', style, error);
  }
};

// All the functions used to get the person
const jwtDecode = t => {
  let token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split(".")[0]));
  token.payload = JSON.parse(window.atob(t.split(".")[1]));
  return token;
};

const getPerson = decoded => {
  const { payload } = decoded;
  const { value } = payload;
  return value;
};

// Getting all data
const getData = async() => {
  // Wine
  const wineStr = document.querySelector(".form__select").value;
  const wine = await getWine(wineStr);

  // Quantity
  const qty = document.getElementById("qty").value;

  // Person
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const person = getPerson(decoded);

  // Purpose
  const purpose = document.getElementById("purpose").value;
  // Comment
  const comment = document.getElementById("comment").value;
  // Destination
  const destinationStr = document.getElementById("destinationStr").value;

  const data = { wine, qty, person, purpose, comment, destinationStr };

  return data;
};

const modal = document.querySelector(".modal");

document.querySelector(".btn").addEventListener("click", () => {
  modal.classList.toggle("displayNone");
  document.querySelector(".form").addEventListener("submit", async(e) => {
    e.preventDefault();
    const data = await getData();
    createSerie(data);
  });
});
