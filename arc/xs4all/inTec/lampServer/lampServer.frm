VERSION 5.00
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "MSWINSCK.OCX"
Begin VB.Form frmLampServer 
   Caption         =   "Form1"
   ClientHeight    =   5625
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   12075
   LinkTopic       =   "Form1"
   ScaleHeight     =   5625
   ScaleWidth      =   12075
   StartUpPosition =   3  'Windows Default
   Begin VB.ListBox lstLog 
      Height          =   5130
      ItemData        =   "lampServer.frx":0000
      Left            =   0
      List            =   "lampServer.frx":0002
      TabIndex        =   0
      Top             =   360
      Width           =   3495
   End
   Begin VB.TextBox txtLog 
      BackColor       =   &H8000000F&
      BeginProperty Font 
         Name            =   "Courier New"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   5175
      Left            =   3600
      MultiLine       =   -1  'True
      TabIndex        =   2
      Top             =   360
      Width           =   8415
   End
   Begin MSWinsockLib.Winsock oServer 
      Index           =   0
      Left            =   3120
      Top             =   0
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
      LocalPort       =   72
   End
   Begin VB.Label Label1 
      Caption         =   "Server Log"
      Height          =   255
      Left            =   0
      TabIndex        =   1
      Top             =   120
      Width           =   3495
   End
End
Attribute VB_Name = "frmLampServer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

'--| log
Private arrMessages(25) As String
Private intNextIndex As Integer
'--| object pool
Private Const cintObjectPoolSize = 5
Private arrObjectInUse(0 To cintObjectPoolSize) As Boolean
'--| web server
Private Const cintPort = 80
'--|
Private Const shtmNotFound = "<html><head><title>404 Not Found</title></head>" & _
    "<body><h1>Not found</h2><p>The requested URL <%url%> was not found on this server at <%now%></p><hr>" & _
    "<address>Doekman-lampServer/1.0 at localhost port " & cintPort & "</address></body></html>"

Private Function getResource(sURL As String) As Variant
  Select Case sURL
  Case "/"
    getResource = _
      "<html><head><title>Schermlamp Server</title></head><body><h1>Schemerlamp Server</h1>" & _
      "<p>Welkom bij de schemerlamp server. Groetjes, Doeke</p><p>Local time: " & _
      Format(Now, "d mmmm yyyy hh:mm:ss") & "</p></body></html>"
  Case Else
    getResource = Null
  End Select
End Function

Private Sub Form_Load()
  Dim i
  intNextIndex = LBound(arrMessages)
  
  logLine "Starting HTTP Server (0)", "Written by the Doekman 2001"
  arrObjectInUse(0) = True '--| managing object always in use
  For i = 1 To cintObjectPoolSize
    Load oServer(i)
    arrObjectInUse(i) = False
  Next
  With oServer(0)
    .Protocol = sckTCPProtocol
    .LocalPort = cintPort
    .Listen
  End With
  logLine "Listening at port " & cintPort & "  with " & cintObjectPoolSize & " objects (0)", "-"
End Sub

Private Sub lstLog_Click()
  txtLog.Text = arrMessages(lstLog.ListIndex)
End Sub

Private Sub oServer_Close(Index As Integer)
  logLine "Connection close (" & Index & ")", "-"
  oServer(Index).Close
  
  logLine "Instance (" & Index & ") takes 5", "-"
  arrObjectInUse(Index) = False
End Sub

Private Sub oServer_Connect(Index As Integer)
  logLine "Connect (" & Index & ")", "-"
End Sub

Private Sub oServer_ConnectionRequest(Index As Integer, ByVal requestID As Long)
  Dim intControlIndex As Integer
  
  If Index = 0 Then
    intControlIndex = getNextFreeIndex
    If intControlIndex = -1 Then
      '--| Too many connections
      oServer(0).Close 'tcp/ip refuse????
      logLine "Too many connections (" & Index & ")", "cintObjectPoolSize=" & cintObjectPoolSize
    Else
      '--| Create new instance
      logLine "Getting instance (" & intControlIndex & ") of break", "-"
      
      arrObjectInUse(intControlIndex) = True
      oServer(intControlIndex).LocalPort = 0
      oServer(intControlIndex).Accept requestID
    End If
  End If
End Sub

Private Sub oServer_DataArrival(Index As Integer, ByVal bytesTotal As Long)
  Dim sData As String, s As String, x
  Dim oRequest As Object, oResponse As Object
  
  oServer(Index).GetData sData, vbString
  
  If Len(sData) = 0 Then
    logLine "DataArrival, but no data (" & Index & ")", "-"
    Exit Sub
  End If
  '--| Do something with the data
  Set oRequest = CreateObject("inTec.httpRequest")
  Debug.Print "oRequest.parse [retval] " & oRequest.parse(sData)
  s = "Headers:"
  For Each x In oRequest.oHeader
    s = s & vbNewLine & x & ": " & oRequest.oHeader.Item(x)
  Next
  logLine "Data received (" & Index & ")", sData
  
  '--| Send response
  Set oResponse = CreateObject("inTec.httpResponse")
  
  Select Case oRequest.sMethod
  Case "HEAD", "GET"
    x = getResource(oRequest.sURL)
    If IsNull(x) Then
      oResponse.sStatus = "404" '--| resource not found
      oResponse.sBody = Replace(Replace(shtmNotFound, "<%now%>", Format(Now, "d mmmm yyyy hh:mm:ss")), "<%url%>", oRequest.sURL)
    Else
      If oRequest.sMethod = "GET" Then
        oResponse.sBody = x
      End If
    End If
  Case Else
    oResponse.sStatus = "501" 'Not implemented
  End Select
  sData = oResponse.toString()
  logLine "Response sent (" & Index & ")", sData
  Call oServer(Index).SendData(sData)
  
  Set oRequest = Nothing
  Set oResponse = Nothing
End Sub

Private Sub oServer_Error( _
  Index As Integer, _
  ByVal Number As Integer, _
  Description As String, _
  ByVal Scode As Long, _
  ByVal Source As String, _
  ByVal HelpFile As String, _
  ByVal HelpContext As Long, _
  CancelDisplay As Boolean _
)
  logLine "Error (" & Index & ")", Number & " " & Description
  
  logLine "Connection close (" & Index & ")", "-"
  oServer(Index).Close
  
  logLine "Instance (" & Index & ") takes 5", "-"
  arrObjectInUse(Index) = False
End Sub

Private Sub oServer_SendComplete(Index As Integer)
  logLine "Send complete (" & Index & ")", "-"
End Sub

Private Sub logLine(sLine As String, sData As String)
  If lstLog.ListCount >= UBound(arrMessages) Then
    lstLog.RemoveItem intNextIndex
  End If
  lstLog.AddItem Format(Now, "hh:mm:ss ") & sLine, intNextIndex
  arrMessages(intNextIndex) = sData
  intNextIndex = intNextIndex + 1
  If intNextIndex >= UBound(arrMessages) Then
    intNextIndex = LBound(arrMessages)
  End If
End Sub

Private Function getNextFreeIndex() As Long
  Dim i As Long
  For i = LBound(arrObjectInUse) To UBound(arrObjectInUse)
    If Not arrObjectInUse(i) Then
      getNextFreeIndex = i
      Exit Function
    End If
  Next
  '--| No free object
  getNextFreeIndex = -1
End Function

Private Sub oServer_SendProgress(Index As Integer, ByVal bytesSent As Long, ByVal bytesRemaining As Long)
  logLine "Send Progress (" & Index & ")", "bytesSent=" & bytesSent & vbNewLine & "bytesRemaining=" & bytesRemaining
End Sub
