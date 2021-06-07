//package imports
import mongoose from 'mongoose';

const itemCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', itemCategorySchema);

export default Category;
