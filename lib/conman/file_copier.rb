module Conman
  class FileCopier
    # install_root:: where the root of conman's install is, to find files to copy
    # destination_root:: root of where we are copying to
    def initialize(install_root,destination_root)
      @install_root     = install_root
      @destination_root = destination_root
    end

    # Shallow copies all files from +from+ with the given extension
    #
    # from:: location, relative to @install_root where files are copied from
    # extension:: extension of files to copy
    def copy_files(from,extension)
      dest_dir = File.join(@destination_root,from)
      FileUtils.mkdir(dest_dir)
      Dir["#{@install_root}/#{from}/*.#{extension}"].each do |file|
        FileUtils.cp file,dest_dir
      end
    end
  end
end
