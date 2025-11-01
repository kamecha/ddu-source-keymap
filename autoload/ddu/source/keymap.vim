function! ddu#source#keymap#feedkeys(keys) abort
	" escape "<CR>" -> "\<CR>"
	" TODO: For non-special keys like "<hoge>", we want to keep them as they are.
	" refer to https://github.com/kuuote/dotvim/blob/a522b18d59b05abee70cb97be22c6ca66c54a852/autoload/vimrc/keycode.vim#L3
	let quoted = substitute(a:keys, '<[^>]*>', '\=eval(''"\'' .. submatch(0) .. ''"'')', 'g')
	call feedkeys(quoted)
endfunction
