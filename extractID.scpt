(* 
	This AppleScript for Automator.app extracts numbers from the names of the received files or folders (aliases) 
	and copies the result to the clipboard 

	For example it will copy '57123" from a file named Myfile-57123.jpg
	All messages in Russian
*)

on run {input, parameters}
	
	set fileList to {}
	set AppleScript's text item delimiters to {", "}
	
	repeat with a in input
		if (folder of (info for a) is true) then
			set fileList to fileList & (list folder a without invisibles)
		else
			set end of fileList to (name of (info for a))
		end if
	end repeat
	
	try
		do shell script "echo " & (quoted form of (fileList as text)) & " | grep \"\\d\\d\\d\\+\" -o | sort --unique | pbcopy"
		 
		if ((the clipboard) is "") then
			display alert "Упс" message ("В этих файлах нет никаких номеров") buttons ("Попробую еще раз")
			
		else
			set theQuantity to (count words in (the clipboard))
			
			if (theQuantity) < 50 then
				set theMessage to words of (the clipboard) as text
			else
				set theMessage to (words 1 thru 50 of (the clipboard) as text) & " ... " & last word of (the clipboard)
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
