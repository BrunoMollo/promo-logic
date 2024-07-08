type Product = {
  base_price: number;
};

type Promo =
  | {
      type: "discount";
      discount_percentage: number;
    }
  | {
      type: "discont-from-minimum";
      discount_percentage: number;
      min: number;
    }
  | {
      type: "Buys-x-Pays"; // 2x1
      buys: number;
      pays: number;
    };

type Sale_Item = {
  amount: number;
  product: Product;
};

function calculate_line_price(item: Sale_Item, promo: Promo) {
  if (promo.type == "discount") {
    const before_price = item.amount * item.product.base_price;
    const coeficient = (100 - promo.discount_percentage) / 100;
    return before_price * coeficient;
  }

  if (promo.type === "discont-from-minimum") {
    const before_price = item.amount * item.product.base_price;
    if (item.amount < promo.min) {
      return before_price;
    }

    const coeficient = (100 - promo.discount_percentage) / 100;
    return before_price * coeficient;
  }

  if (promo.type === "Buys-x-Pays") {
    const groups = Math.floor(item.amount / promo.buys);
    const rest = item.amount % promo.buys;
    const amount_to_pay = groups * promo.pays + rest;
    return amount_to_pay * item.product.base_price;
  }
}

import { test, expect, describe } from "vitest";

describe("fixed discount", () => {
  test("10% discount, 1 item $100 -> $90", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 1 },
      { type: "discount", discount_percentage: 10 },
    );
    expect(cost).toBe(90);
  });

  test("10% discount, 2 items", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 2 },
      { type: "discount", discount_percentage: 10 },
    );
    expect(cost).toBe(180);
  });

  test("10% discount, 3 items", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 3 },
      { type: "discount", discount_percentage: 10 },
    );
    expect(cost).toBe(3 * 90);
  });
});

describe("discount with minumun", () => {
  test("20% discount after 2 items, with 1 item", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 1 },
      { type: "discont-from-minimum", discount_percentage: 20, min: 2 },
    );
    expect(cost).toBe(100);
  });

  test("20% discount after 2 items, with 2 item  $200 -> $160", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 2 },
      { type: "discont-from-minimum", discount_percentage: 20, min: 2 },
    );
    expect(cost).toBe(160);
  });

  test("20% discount after 2 items, with 2 item $300 -> $240", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 3 },
      { type: "discont-from-minimum", discount_percentage: 20, min: 2 },
    );
    expect(cost).toBe(80 * 3);
  });
});
describe("2x1", () => {
  test("2x1, with 1 item $100 -> $100", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 1 },
      { type: "Buys-x-Pays", buys: 2, pays: 1 },
    );
    expect(cost).toBe(100);
  });

  test("2x1, with 2 item $200 -> $100", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 2 },
      { type: "Buys-x-Pays", buys: 2, pays: 1 },
    );
    expect(cost).toBe(100);
  });

  test("2x1, with 3 item $300 -> $200", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 3 },
      { type: "Buys-x-Pays", buys: 2, pays: 1 },
    );
    expect(cost).toBe(200);
  });
});

describe("3x2", () => {
  test("3x2, with 1 item $100 -> $100", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 1 },
      { type: "Buys-x-Pays", buys: 3, pays: 2 },
    );
    expect(cost).toBe(100);
  });

  test("3x2, with 2 item $200 -> $200", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 2 },
      { type: "Buys-x-Pays", buys: 3, pays: 2 },
    );
    expect(cost).toBe(200);
  });

  test("3x2, with 3 item $300 -> $200", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 3 },
      { type: "Buys-x-Pays", buys: 3, pays: 2 },
    );
    expect(cost).toBe(200);
  });

  test("3x2, with 4 item $400 -> $300", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 4 },
      { type: "Buys-x-Pays", buys: 3, pays: 2 },
    );
    expect(cost).toBe(300);
  });

  test("3x2, with 5 item $500 -> $400", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 5 },
      { type: "Buys-x-Pays", buys: 3, pays: 2 },
    );
    expect(cost).toBe(400);
  });

  test("3x2, with 6 item $600 -> $400", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 6 },
      { type: "Buys-x-Pays", buys: 3, pays: 2 },
    );
    expect(cost).toBe(400);
  });
});

describe("5x3", () => {
  test("5x3, with 1 item $100 -> $100", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 1 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(100);
  });

  test("5x3, with 2 item $200 -> $200", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 2 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(200);
  });

  test("5x3, with 3 item $300 -> $300", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 3 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(300);
  });

  test("5x3, with 4 item $400 -> $400", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 4 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(400);
  });

  test("5x3, with 5 item $500 -> $300", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 5 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(300);
  });

  test("5x3, with 6 item $600 -> $400", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 6 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(400);
  });

  test("5x3, with 7 item $700 -> $500", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 7 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(500);
  });

  test("5x3, with 8 item $800 -> $600", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 8 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(600);
  });

  test("5x3, with 9 item $900 -> $700", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 9 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(700);
  });

  test("5x3, with 10 item $1000 -> $600", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 10 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(600);
  });

  test("5x3, with 11 item $1000 -> $700", () => {
    const cost = calculate_line_price(
      { product: { base_price: 100 }, amount: 11 },
      { type: "Buys-x-Pays", buys: 5, pays: 3 },
    );
    expect(cost).toBe(700);
  });
});
