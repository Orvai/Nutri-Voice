-- Ensure upsert by name is safe and deterministic for FoodItem
CREATE UNIQUE INDEX "FoodItem_name_key" ON "FoodItem"("name");
