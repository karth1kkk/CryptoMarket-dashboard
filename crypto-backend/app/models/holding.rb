class Holding < ApplicationRecord
  belongs_to :user

  validates :coin_id, presence: :true, uniqueness: {scope: :user_id}
  validates :amount, numericality: {greater_than: 0 }
  validates :avg_cost_usd, numericality: {greater_than_or_equal_to: 0}, allow_nil: true
end
