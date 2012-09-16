module Trickster
  # Base copier for copying files from the trickster install to the slideshow location
  class Copier
    # install_root:: where the root of trickster's install is, to find files to copy
    # destination_root:: root of where we are copying to
    def initialize(install_root,destination_root)
      @install_root     = install_root
      @destination_root = destination_root
    end
  end
end
