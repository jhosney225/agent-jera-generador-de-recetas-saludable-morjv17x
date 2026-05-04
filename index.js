
```javascript
import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function generateRecipe(ingredients, calorieTarget, dietaryRestrictions) {
  console.log('\n🍳 Generando receta saludable...\n');

  const prompt = `You are a professional nutritionist and chef. Generate a healthy recipe with the following requirements:

Ingredients available: ${ingredients}
Target calories: ${calorieTarget}
Dietary restrictions: ${dietaryRestrictions || 'None'}

Please provide:
1. Recipe name
2. List of ingredients with quantities
3. Step-by-step cooking instructions
4. Total calories per serving
5. Macronutrient breakdown (proteins, carbs, fats)
6. Health benefits of this recipe
7. Serving suggestions

Format the response clearly with headers and bullet points.`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

async function getRecipeIdeas(mealType, servings) {
  console.log('\n💡 Generando ideas de recetas...\n');

  const prompt = `You are a nutritionist expert. Generate 5 quick healthy recipe ideas for ${mealType} that serves ${servings} people.

For each recipe, provide:
1. Recipe name
2. Main ingredients
3. Estimated prep time
4. Approximate calories per serving
5. Why it's healthy

Keep it concise and practical.`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

async function analyzeMealPlan(meals) {
  console.log('\n📊 Analizando plan de comidas...\n');

  const prompt = `You are a nutrition expert. Analyze the following meal plan and provide nutritional insights:

Meals: ${meals}

Please provide:
1. Total estimated calories
2. Macronutrient distribution
3. Nutritional balance assessment
4. Suggestions for improvements
5. Overall healthiness rating (1-10)
6. Specific recommendations

Be concise and practical.`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   GENERADOR DE RECETAS SALUDABLES 🥗   ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('Opciones:');
  console.log('1. Generar receta personalizada');
  console.log('2. Obtener ideas de recetas');
  console.log('3. Analizar plan de comidas');
  console.log('4. Salir');
  console.log('');

  let running = true;

  while (running) {
    const choice = await question('\n¿Qué deseas hacer? (1-4): ');

    switch (choice.trim()) {
      case '1': {
        const ingredients = await question('\nIngredientes disponibles (separados por comas): ');
        const calorieTarget = await question('Calorías objetivo: ');
        const dietary = await question('Restricciones dietéticas (opcional): ');

        if (ingredients.trim()) {
          const recipe = await generateRecipe(ingredients, calorieTarget, dietary);
          console.log('\n' + '='.repeat(50));
          console.log(recipe);
          console.log('='.repeat(50));
        } else {
          console.log('Por favor, ingresa al menos algunos ingredientes.');
        }
        break;
      }

      case '2': {
        const mealType = await question('\n¿Qué tipo de comida? (desayuno/almuerzo/cena/snack): ');
        const servings = await question('¿Para cuántas personas? (default: 2): ');

        const ideas = await getRecipeIdeas(mealType || 'breakfast', servings || '2');
        console.log('\n' + '='.repeat(50));
        console.log(ideas);
        console.log('='.repeat(50));
        break;
      }

      case '3': {
        const meals = await question('\nDescribe las comidas del día (separadas por punto y coma): ');

        if (meals.trim()) {
          const analysis = await analyzeMealPlan(meals);
          console.log('\n' + '='.repeat(50));
          console.log(analysis);
          console.log('='.repeat(50));
        } else {
          console.log('Por favor, describe al menos una comida.');
        }
        break;
      }

      case '4': {
        console.log('\n¡Gracias por usar el Generador de Recetas Saludables! 👋');
        running = false;