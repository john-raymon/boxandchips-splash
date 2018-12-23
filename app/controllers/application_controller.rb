class ApplicationController < ActionController::Base
  before_action :mail_chimp

  def mail_chimp
    if ENV['MAILCHIMP_API_KEY']
      @mailchimp = Gibbon::Request.new(api_key: ENV['MAILCHIMP_API_KEY'], symbolize_keys: true)
      @mailchimp.timeout = 30
      @mailchimp.open_timeout = 30
    end
  end

end
