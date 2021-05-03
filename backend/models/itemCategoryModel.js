import mongoose from 'mongoose';

const itemCategorySchema = mongoose.Schema(
  {
    category: {
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

const Item = mongoose.model('Category', itemCategorySchema);

export default Item;
