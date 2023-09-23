async function post_request(url, data) {
  try {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    const parsedData = await response.json();
    return parsedData;
  } catch (error) {
    console.error(error);
  }
}

async function post_data(url) {
  const data = {
    name: "shabnam bano",
    contactNumber: "8905640403",
    email: "shabnam@gmail.com",
    password: "1234",
  };
  const result = await post_request(url, data);
  console.log(result);
}

post_data(`http://localhost:8001/user/signUp`);
