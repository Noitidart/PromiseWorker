var user32 = ctypes.open('user32.dll');

var msgBox = user32.declare("MessageBoxW",
                         ctypes.winapi_abi,
                         ctypes.int32_t,
                         ctypes.int32_t,
                         ctypes.jschar.ptr,
                         ctypes.jschar.ptr,
                         ctypes.int32_t);

function ask(msg) {
	var MB_OK = 0;
	var MB_YESNO = 4;
	var IDYES = 6;
	var IDNO = 7;
	var IDCANCEL = 2;

	var ret = msgBox(0, msg, "Asking Question", MB_YESNO);
	return ret;
}