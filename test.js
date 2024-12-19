import http from "k6/http";
import { sleep } from 'k6';
import { check } from "k6";




const BASE_URL = __ENV.BASE_URL || "http://localhost:3333";

export const options = {
  // iternations: 30, //number of iterations per virtual users
  //vus: 10, //number of virtual users
  // durations: '20s', //time in which pushes the possile number of iterations per vu
  stages: [
    { duration: '5s', target: 20 }, //ramp up
    { duration: '30s', target: 20 }, // run
    { duration: '5s', target: 0 }, // ramp down
  ],

};
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data), // the default data object
  };
}

export default function () {
  let restrictions = {
    maxCaloriesPerSlice: 500,
    mustBeVegetarian: false,
    excludedIngredients: ["pepperoni"],
    excludedTools: ["knife"],
    maxNumberOfToppings: 6,
    minNumberOfToppings: 2,
  };
  let res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(restrictions), {
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": 23423,
    },
  });
  check(res, {
    "is status 200": (r) => r.status === 500,
  });
  console.log(`${res.json().pizza.name} (${res.json().pizza.ingredients.length} ingredients)`);
  sleep(1);
}