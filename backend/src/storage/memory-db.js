// Simple in-memory database implementation
class MemoryDB {
  constructor() {
    this.requests = new Map();
    
    // Add some sample data for testing
    this.addSampleData();
  }

  // Generate a simple unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Push a new item and return its ID
  async push(data) {
    try {
      const id = this.generateId();
      this.requests.set(id, data);
      console.log(`Added item with ID ${id} to database`);
      return { key: id };
    } catch (error) {
      console.error('Error adding item to database:', error);
      throw new Error('Failed to store request data');
    }
  }

  // Get all items
  async getAll() {
    try {
      const items = Array.from(this.requests.entries()).map(([key, value]) => ({
        id: key,
        ...value
      }));
      console.log(`Retrieved ${items.length} items from database`);
      return items;
    } catch (error) {
      console.error('Error retrieving all items:', error);
      return [];
    }
  }

  // Get item by ID
  async get(id) {
    try {
      const data = this.requests.get(id);
      if (!data) {
        console.log(`Item with ID ${id} not found`);
        return null;
      }
      console.log(`Retrieved item with ID ${id}`);
      return { key: id, val: () => data };
    } catch (error) {
      console.error(`Error retrieving item with ID ${id}:`, error);
      return null;
    }
  }

  // Update item by ID
  async update(id, data) {
    try {
      const existingData = this.requests.get(id);
      if (!existingData) {
        console.log(`Cannot update: Item with ID ${id} not found`);
        throw new Error('Item not found');
      }
      const updatedData = { ...existingData, ...data };
      this.requests.set(id, updatedData);
      console.log(`Updated item with ID ${id}`);
      return updatedData;
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Add some sample data for testing
  addSampleData() {
    const sampleData = [
      {
        text: "I need medical assistance at 123 Main St. I have a broken leg and can't move.",
        urgency: "High",
        type: "Medical",
        location: "123 Main St",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: "processing"
      },
      {
        text: "Our building at 456 Oak Ave has been damaged by flooding and we need shelter.",
        urgency: "Medium",
        type: "Shelter",
        location: "456 Oak Ave",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        status: "pending"
      }
    ];
    
    sampleData.forEach(item => {
      const id = this.generateId();
      this.requests.set(id, item);
    });
    
    console.log(`Added ${sampleData.length} sample items to database`);
  }

  // Delete item by ID
  async delete(id) {
    return this.requests.delete(id);
  }
}

// Create and export a singleton instance
const db = new MemoryDB();
module.exports = db;
