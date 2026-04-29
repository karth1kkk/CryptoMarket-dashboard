class AccessToken < ApplicationRecord
  belongs_to :user

  before_create :assign_token

  private

  def assign_token
    self.token = SecureRandom.hex(32)
  end
end
