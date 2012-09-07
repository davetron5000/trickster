AWESOME PRESENTATION
!TITLE
This is a slide

!BULLETS
Bullet title
* some bullets
* here are more
* and here's some

!CODE
def doit
  puts "blah?"
  return "foo" if crud?
  puts "bar"

  return "bar"
end

!TITLE
Too verbose
Let's fix it

!CODE: callout=3,4,5,6,7,8
def doit
  puts "blah?"
  if crud?
    return "foo"
  else
    puts "bar"
    return "bar"
  end
end

!COMMANDLINE
> ls -l
foo   bar.c   main.o
> bundle exec rails console production
irb> puts "yay, console"

!SECTION
Section
Subsection title
