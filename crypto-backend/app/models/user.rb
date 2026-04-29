class User < ApplicationRecord
    has_secure_password
    
    has_many :access_tokens, dependent: :destroy
    has_many :watchlist_items, dependent: :destroy
    has_many :holdings, dependent: :destroy

    validates :email, presence: true, uniqueness: { case_sensitive: false }
    normalizes :email, with: ->(e) {e.strip.downcase if e}
end
