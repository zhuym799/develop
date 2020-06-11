--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%%                                                                 %%%
--%%%   This script tests for the presence of Internet Explorer       %%%
--%%%                                                                 %%%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

--[[
**********************************************************************************
Function:	ir_GetIEVersion()
Purpose:	Detects Internet Explorer
Arguments:	None.
Returns:	Version number, 0.0.0.0 if Internet Explorer does not exist
**********************************************************************************
]]
function ir_GetIEVersion()
	local bOK = true;
	local strFileName = "";
	local strVersion = "0.0.0.0";
	
	bOK = Registry.DoesKeyExist(HKEY_CLASSES_ROOT,"CLSID\\{8856F961-340A-11D0-A96B-00C04FD705A2}\\InprocServer32");
	
	if (bOK) then
		strFileName = Registry.GetValue(HKEY_CLASSES_ROOT,"CLSID\\{8856F961-340A-11D0-A96B-00C04FD705A2}\\InprocServer32","NoName",true);
		if (Application.GetLastError() ~= 0) then	
			bOK = false;
		end
	else
		bOK = Registry.DoesKeyExist(HKEY_CLASSES_ROOT,"CLSID\\{0002DF01-0000-0000-C000-000000000046}\\LocalServer32");
	
		
		if (bOK) then
			strFileName = Registry.GetValue(HKEY_CLASSES_ROOT,"CLSID\\{0002DF01-0000-0000-C000-000000000046}\\LocalServer32","",true);
			if (Application.GetLastError() ~= 0) then	
				bOK = false;
			end
		end
	end
	
	strFileName = String.TrimLeft(strFileName,"\"");
	strFileName = String.TrimRight(strFileName,"\"");
	
	if (bOK) then
		-- Detect the version of the file here...
		verInfo = File.GetVersionInfo(strFileName);
		if(Application.GetLastError() ~= 0)then
			strVersion = "0.0.0.0";
		else
			-- OK, we have the file version
			strVersion = verInfo.FileVersion;
		end
	end
	
	if (bOK ~= true) then
		strVersion = "0.0.0.0";
	end
	
	return strVersion;
end