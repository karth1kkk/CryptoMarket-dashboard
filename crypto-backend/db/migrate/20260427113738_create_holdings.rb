class CreateHoldings < ActiveRecord::Migration[8.1]
  def change
    create_table :holdings do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :coin_id
      t.decimal :amount
      t.decimal :avg_cost_usd

      t.timestamps
    end

    add_index :holdings, [:user_id, :coin_id], unique: true
  end
end
