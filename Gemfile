source 'https://rubygems.org'

ruby "~>3.4.2"
gem "jekyll", "~> 4.3.2"


group :jekyll_plugins do
  gem 'jekyll-sitemap'
  gem 'jekyll-gzip'
  gem "jekyll-last-modified-at"
  gem 'jekyll-seo-tag'
  gem 'jekyll-feed'
  gem 'jekyll-sass-converter'
  gem 'jekyll-paginate'
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem 'wdm', '>= 0.1.0' if Gem.win_platform?

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

gem "csv"
gem "base64"