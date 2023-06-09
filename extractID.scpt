on run {input, parameters}
	
	set theList to ""
	
	repeat with a in input
		if folder of (info for a) is true then
			set fileList to list folder a without invisibles
			repeat with theItem in fileList
				set theList to (theList & quoted form of theItem as string) & " "
			end repeat
		else
			set theList to (theList & quoted form of name of (the info for a) as string) & " "
		end if
	end repeat
	
	try
		do shell script "echo " & theList & " | grep \"\\d\\d\\d\\+\" -o | pbcopy"
		
		if (the clipboard) is "" then
			display alert "Упс" message ("В этих файлах нет никаких номеров") buttons ("Попробую еще раз")
			
		else
			set theQuantity to (count words in (the clipboard))
			set {oldTID, AppleScript's text item delimiters} to {AppleScript's text item delimiters, ", "}
			
			if (theQuantity) < 50 then
				set theMessage to words of (the clipboard) as string
			else
				set theMessage to (words 1 thru 50 of (the clipboard) as string) & " ... " & last word of (the clipboard)
			end if
			
			set theNumCount to (theQuantity mod 100)
			set theNumCount1 to (theNumCount mod 10)
			
			if ((theNumCount > 10) and (theNumCount < 20)) then
				set theNumbers to "номеров"
			else if ((theNumCount1 > 1) and (theNumCount1 < 5)) then
				set theNumbers to "номера"
			else if (theNumCount1 = 1) then
				set theNumbers to "номер"
			else
				set theNumbers to "номеров"
			end if
			
			display alert ("Копирую " & theQuantity & " " & theNumbers & ":") message (theMessage) buttons ("Замечательно!")
		end if
		
	on error
		display alert "Упс" message "Случилась какая-то ошибка." buttons ("Ну что ж")
	end try
	
	return null
end run
