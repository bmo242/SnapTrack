export const categoryColorMap: { [key: string]: string } = {
  "Food Photography": "bg-yellow-500",
  "Corporate Portraits": "bg-blue-500",
  "Commercial Photography": "bg-purple-500",
  "Weddings": "bg-pink-500",
  "Product Photography": "bg-green-500",
  "Other": "bg-gray-500",
  "Uncategorized": "bg-gray-400",
  "All": "bg-gray-300", // For the filter, though not directly used on job cards
};

export const getCategoryColor = (category: string): string => {
  return categoryColorMap[category] || categoryColorMap["Uncategorized"];
};