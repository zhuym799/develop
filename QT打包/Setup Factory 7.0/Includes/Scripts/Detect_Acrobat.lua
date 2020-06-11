--[[
**********************************************************************************
Function:	ir_GetAcrobatVersion()
Purpose:	Detects the existance of Adobe Acrobat Reader / Adobe Acrobat
Arguments:	None.
Returns:	Version number, 0.0.0.0 if Acrobat / Acrobat Reader does not exist
**********************************************************************************
]]





function ir_GetAcrobatVersion()
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   LOCAL VARIABLE DECLARATION - CHANGE THESE FOR EACH PROGRAM   %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	local AcrobatFullVer = "0.0.0.0";
	local bOK = true;	
	local strVersion = "0.0.0.0";

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   CHECK FOR ACROBAT READER ENTRY IN SYSTEM REGISTRY            %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	bOK = Registry.DoesKeyExist(HKEY_CLASSES_ROOT,"CLSID\\{B801CA65-A1FC-11D0-85AD-444553540000}\\LocalServer");	

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   IF ACROBAT READER EXISTS IN THE REGISTRY, GET THE FILENAME   %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	if (bOK) then
		strFileName = Registry.GetValue(HKEY_CLASSES_ROOT,"CLSID\\{B801CA65-A1FC-11D0-85AD-444553540000}\\LocalServer","NoName",true);
		if (Application.GetLastError() ~= 0) then	
			bOK = false;
		end
	end

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   IF THE FILENAME WAS RETRIEVED SUCCESSFULLY, GET VERSION #    %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   IF THERE WERE ANY PROBLEMS, SET VERSION # TO 0.0.0.0         %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	if (bOK ~= true) then
		strVersion = "0.0.0.0";
	end

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   CHECK FOR FULL VERSION OF ACROBAT.  IF FULL VERSION EXISTS,  %%
--%%   USE THE VERSION NUMBER FROM THAT FILE.                       %%
--%%   *NOTE: THIS IS ACCOMPLISHED BY TESTING THE *.PDF DEFAULT     %%
--%%   VIEWER.   IF THE VIEWER IS SET TO THE READER OR ANY OTHER    %%
--%%   PROGRAM, 0.0.0.0 WILL BE RETURNED                            %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	AcrobatFullVer = CheckAcrobatFull();
	if AcrobatFullVer ~= "0.0.0.0" then
		strVersion = AcrobatFullVer;
	end
	
	return strVersion;
end









-- ********* THE FOLLOWING FUNCTION IS CALLED FROM ir_GetAcrobatVersion() ********

function CheckAcrobatFull()

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   LOCAL VARIABLE DECLARATION - CHANGE THESE FOR EACH PROGRAM   %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	local tValidFileNames = {"acrobat"};
	local strDefaultExtension = "pdf";

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   LOCAL VARIABLE DECLARATION                                   %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	local bOK = true;
	local bIsValidViewer = false;
	local strDefaultViewer = "";
	local strVersion = "";
	local j = 0;
	local name = 0;
	local tFileInfo = {};
	local tSplit_Path = {};

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   SET DEFAULT VIEWER VERSION TO 0.0.0.0                        %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	strVersion ="0.0.0.0";

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   GET THE DEFAULT VIEWER FOR THE SPECIFIED EXTENSION           %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	strDefaultViewer = File.GetDefaultViewer(strDefaultExtension);

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   IF THERE IS NO DEFAULT VIEWER, SET VERSION TO 0.0.0.0        %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	if (Application.GetLastError() ~= 0) then
		strVersion = "0.0.0.0";
		bOK = false;
	end

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   IF THERE IS A DEFAULT VIEWER, GET THE FILENAME AND COMPARE   %%
--%%   THE FILENAME TO THE TABLE OF VALID NAMES ABOVE.  IF THE      %%
--%%   NAME IS VALID, GET THE VERSION NUMBER                        %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	if bOK then
		--assume viewer is not valid filename
		bIsValidViewer = false;
	
		tSplit_Path = String.SplitPath(strDefaultViewer);
	        
		--check default viewer against valid filenames
		for j, name in tValidFileNames do
			--compares a caseless strDefaultViewerFile to a list of valid names
			if String.CompareNoCase(tSplit_Path.Filename, name)==0 then
				bIsValidViewer = true;
			end
		end
	
		--if default reader is valid filename
		if bIsValidViewer then
			--get version info (if file does not exist, version string will be empty)
			tFileInfo = File.GetVersionInfo(strDefaultViewer);

			--default viewer does exist, store version number
			strVersion = tFileInfo.FileVersion;	      
		end
	end

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   IF THE DEFAULT FILENAME IS INVALID, ASSIGN VERSION 0.0.0.0   %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	if not bIsValidViewer then
		strVersion = "0.0.0.0";
	end

--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
--%%                                                                %%
--%%   RETURN THE VERSION NUMBER OF THE DEFAULT VIEWER.             %%
--%%   IF THERE IS NO VIEWER, OR THE VIEWER FILENAME DOES NOT MATCH %%
--%%   ONE OF THE ABOVE LISTED FILENAMES, 0.0.0.0 WILL BE RETURNED  %%
--%%                                                                %%
--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	return strVersion;

end