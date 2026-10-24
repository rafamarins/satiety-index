const plates = new Map();

export function loadEngraving(food) {
  if (!plates.has(food.id)) {
    const request = fetch(`./assets/illustrations/${food.id}.svg?v=paper-2`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Illustration request failed: ${response.status}`);
        return response.text();
      })
      .catch((error) => {
        plates.delete(food.id);
        throw error;
      });
    plates.set(food.id, request);
  }
  return plates.get(food.id);
}
