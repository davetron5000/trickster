module Trickster
  class FileCopier < Copier
    # Shallow copies all files from +from+ with the given extension
    #
    # from:: location, relative to @install_root where files are copied from
    # extension:: extension of files to copy
    # options:: options to control the copy.  Currently recognized keys:
    #           :except:: array of filenames to skip
    def copy_files(from,extension,options={})
      dest_dir = File.join(@destination_root,from)
      FileUtils.mkdir(dest_dir) unless File.exists?(dest_dir)
      Dir["#{@install_root}/#{from}/*.#{extension}"].each do |file|
        next if Array(options[:except]).include?(File.basename(file))
        FileUtils.cp file,dest_dir
      end
    end
  end
end
