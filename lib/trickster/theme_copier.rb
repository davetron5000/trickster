module Trickster
  class ThemeCopier < Copier
    # Copies the theme from the trickster install into the @destination_root
    def copy_theme(theme)
      extension = %w(.css .scss).find { |extension| File.exists?(trickster_css_file(theme,extension)) }
      destination_file = File.join(@destination_root,'css','theme' + extension)
      FileUtils.cp trickster_css_file(theme,extension),destination_file
    end

  private

    def trickster_css_file(theme,extension)
      (File.join(@install_root,'css','themes',theme + extension))
    end
  end
end
