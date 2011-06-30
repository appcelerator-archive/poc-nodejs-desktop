import os, subprocess, time

class TiNodeJS:
    def __init__(self):
        self.platform = Titanium.getPlatform()
        if self.platform == 'win':
            alert('Sorry the Windows platform is not supported yet!');
            return
        
        self.nodepid = None
        self.nodeproc = None
        self.sep = Titanium.Filesystem.getSeparator()
        self.noderoot = Titanium.App.getHome() + self.sep + 'Resources' + self.sep + 'nodejs'
        self.nodebinary = self.noderoot + self.sep + 'builds' + self.sep + self.platform + self.sep + 'node' + self.sep + 'bin' + self.sep + 'node'
        self.pathtoappserver = Titanium.App.getHome() + self.sep + 'Resources' + self.sep + 'appserver.js'
    
    def startup(self, callback):
        print '@@@ Doing tinode startup!'
        
        #The first time through we'll need to set the execution bit
        if not os.access(self.nodebinary, os.X_OK):
            os.chmod(self.nodebinary, 744)
        
        self.nodeproc = subprocess.Popen(['nohup', self.nodebinary,  self.pathtoappserver])
        self.nodepid = self.nodeproc.pid
        print('Node started pid = %d' % self.nodepid)

        time.sleep(1) #Give server a moment to start listening (@TODO: actually verify it is listening)
        callback()

    def shutdown(self):
        print '@@@ Doing tinode shutdown!'
        
        if self.nodepid is not None:
            print('Killing Node pid = %d' % self.nodepid)
            
            #self.nodeproc.terminate()
            #self.nodeproc.wait()
            os.kill(self.nodepid, 6)
            os.wait()