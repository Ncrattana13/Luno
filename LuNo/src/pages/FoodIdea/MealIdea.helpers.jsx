// TheMealDB's free filter.php endpoint only accepts one ingredient per call,
// so multi-ingredient search fetches each ingredient separately and merges the results.
function toApiIngredient(ingredient) {
    return encodeURIComponent(ingredient.trim().replace(/\s+/g, "_"));
}

export function parseIngredients(text) {
    return text
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function FindRecipe(ingredient) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${toApiIngredient(ingredient)}`);
    if(!res.ok){
        throw new Error("Fail to fetch the recipes");
    }

    const data = await res.json();
    return data.meals || [];
}

// Searches every ingredient the user has and returns the de-duplicated union of
// matching meals, sorted so recipes matching the most of the given ingredients
// come first (ties broken alphabetically).
export async function FindRecipesByIngredients(ingredients) {
    const results = await Promise.all(ingredients.map(FindRecipe));

    const merged = new Map();
    results.forEach((meals) => {
        meals.forEach((meal) => {
            const existing = merged.get(meal.idMeal);
            if (existing) {
                existing.matchCount += 1;
            } else {
                merged.set(meal.idMeal, { ...meal, matchCount: 1 });
            }
        });
    });

    return Array.from(merged.values()).sort((a, b) =>
        b.matchCount - a.matchCount || a.strMeal.localeCompare(b.strMeal)
    );
}

export async function GetMealDetails(id) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (!res.ok) {
        throw new Error("Fail to fetch the recipe details");
    }

    const data = await res.json();
    return data.meals?.[0] || null;
}

// TheMealDB stores each recipe's ingredients as 20 flat strIngredientN / strMeasureN fields.
export function extractIngredients(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const name = meal[`strIngredient${i}`]?.trim();
        if (!name) continue;

        ingredients.push({
            name,
            measure: meal[`strMeasure${i}`]?.trim() || "",
        });
    }

    return ingredients;
}
