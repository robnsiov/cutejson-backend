import { faker } from "@faker-js/faker";
import errorMessage from "../utils/error-message.js";
import ERROR_MESSAGES from ".././constants/errors.js";

const createFakeData = (req, res) => {
  const { repeat } = req.query;

  const generateData = () => {
    const fakeData = faker.helpers.fake(JSON.stringify(req.body));
    const parsedData = JSON.parse(fakeData);
    return parsedData;
  };

  try {
    let data = [];
    const rp = parseInt(repeat);
    if (!isNaN(rp)) {
      if (rp > 100)
        return res.status(400).json(errorMessage(ERROR_MESSAGES.MAX_REPEAT));
      Array.from({ length: rp }).forEach(() => {
        data.push(generateData());
      });
    } else {
      data = generateData();
    }
    res.status(201).json(data);
  } catch {
    res.status(400).json(errorMessage(ERROR_MESSAGES.INVALID_TEMPLATE));
  }
};

export default createFakeData;
