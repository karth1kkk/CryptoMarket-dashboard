class CreateWatchlistItems < ActiveRecord::Migration[8.1]
  def change
    create_table :watchlist_items do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :coin_id
      
      t.timestamps
    end

    add_index :watchlist_items, [:user_id, :coin_id], unique: true
    add_index :watchlist_items, :coin_id
  end
end
