class PagesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def splash

  end

end
