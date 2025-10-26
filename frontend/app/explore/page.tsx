"use client"

import { useState } from "react";
import { Header } from "@/components/header";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { postsApi } from "@/lib/api-client";
// NOTE: You will need to ensure your TaskCard and other component imports are correct.

// ----------------------------------------------------------------------
// 1. TYPES & CONSTANTS (SHARED)
// ----------------------------------------------------------------------

// Backend structure based on your API response
interface BackendTask {
  _id: string;
  Title: string;
  Type: string; // Used for category filtering
  Description: string;
  NeedAmount: number; // The target goal amount
  WalletAddr: string;
  NgoRef: string;
}

// Frontend structure (cleaned up for rendering)
interface Task {
  id: string; // Mapped from _id (for React key)
  title: string; // Mapped from Title
  category: string; // Mapped from Type
  goal: number; // Mapped from NeedAmount
  raised: number; // Safely set to 0 as it's missing in your current API data
  // Add other properties you use in TaskCard here (e.g., ngo, imgCid)
}

const categories = ["All", "education", "health", "food", "shelter"]; 

// ----------------------------------------------------------------------
// 2. CLIENT COMPONENT (Interactivity & Rendering)
// ----------------------------------------------------------------------

interface ClientExplorePageProps {
  initialTasks: Task[];
}

// Define the rendering component as a client component
const ClientExplorePage: React.FC<ClientExplorePageProps> = ({ initialTasks }) => {
  "use client"; // Marks this block as client-side code

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTasks = initialTasks.filter((task) => {
    // 💡 Filter on cleaned property names (title, category)
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || task.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Explore Tasks</h1>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tasks or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category} // Key prop fixed here
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              // 💡 Key prop uses the unique 'id' mapped from '_id'
              <TaskCard key={task.id} task={task} /> 
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tasks found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ----------------------------------------------------------------------
// 3. SERVER COMPONENT (Data Fetching & Wrapper)
// ----------------------------------------------------------------------

interface ApiResponse {
  statusCode: number;
  data: BackendTask[];
  message: string;
  success: boolean;
}

// Default export is the Server Component that fetches data and renders the client component
export default async function ExplorePage() {
  let initialTasks: Task[] = [];
  
  try {
    const apiResponse: ApiResponse = await postsApi.getAll();
    console.log(apiResponse);
    if (apiResponse.success && apiResponse.data && Array.isArray(apiResponse.data)) {
        initialTasks = apiResponse.data.map(item => ({
             // Mapping Logic: Cleaning and normalizing properties
             id: item._id, 
             title: item.Title,
             category: item.Type.toLowerCase(), // Normalize category to lowercase
             goal: item.NeedAmount,
             
             // 💡 FIX for Runtime Error: Setting 'raised' to 0 explicitly
             raised: 0, 
        }));
    }
    
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    // Return empty array on error
    initialTasks = []; 
  }

  // Pass the clean, safe data to the client component
  return <ClientExplorePage initialTasks={initialTasks} />;
}