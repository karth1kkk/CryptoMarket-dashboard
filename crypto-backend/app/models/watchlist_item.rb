class WatchlistItem < ApplicationRecord
  belongs_to :user

  validates :coin_id, presence: true, uniqueness: {scope: :user_id}
end
