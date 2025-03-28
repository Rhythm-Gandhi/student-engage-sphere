
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "All Events" },
  { id: "workshop", label: "Workshops" },
  { id: "social", label: "Social" },
  { id: "academic", label: "Academic" },
  { id: "sports", label: "Sports" },
  { id: "career", label: "Career" }
];

interface CategoryFilterProps {
  activeCategory: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(category.id)}
          className={
            activeCategory === category.id
              ? ""
              : category.id !== "all"
              ? `hover:bg-category-${category.id}/10 hover:text-category-${category.id} hover:border-category-${category.id}/50`
              : ""
          }
          style={
            activeCategory === category.id && category.id !== "all"
              ? { backgroundColor: `var(--category-${category.id})` }
              : {}
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
