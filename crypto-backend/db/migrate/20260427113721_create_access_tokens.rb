class CreateAccessTokens < ActiveRecord::Migration[8.1]
  def change
    create_table :access_tokens do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :token

      t.timestamps
    end
    add_index :access_tokens, :token
  end
end
