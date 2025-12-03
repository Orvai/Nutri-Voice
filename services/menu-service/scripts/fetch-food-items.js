async function fetchHealthGov() {
    const url =
      'https://data.gov.il/api/3/action/datastore_search?resource_id=0557c019-dc94-4c94-8f52-64c4239c4b85&limit=2000';
  
    const res = await fetch(url);
    const data = await res.json();
  
    if (!data.result || !data.result.records) {
      console.log("⚠️ GOV API ERROR:", data);
      return []; 
    }
  
    return data.result.records.map((r) => ({
      name: r["SHM MITBASH"],
      category: r["SUG"],
      caloriesPer100g: parseFloat(r["KCAL"]),
      proteinPer100g: parseFloat(r["PROTEIN"]),
      carbsPer100g: parseFloat(r["CARBS"]),
      fatPer100g: parseFloat(r["FAT"]),
    }));
  }
  