#ifndef LOG_H
#define LOG_H

//#define LOG_FRAMES

#ifndef INSTANCE
	#define INSTANCE
#endif

#include <sstream>
#include <ppapi/cpp/var.h>


std::stringstream __logStream;
#define Log(exp) __logStream.str(std::string()); __logStream << "Em " << __FILE__ <<":"<< __LINE__ <<" - " << exp; INSTANCE.LogToConsole(PP_LOGLEVEL_LOG,__logStream.str())
#define LogError(error, exp) __logStream.str(std::string()); __logStream << "Em " << __FILE__ <<":"<< __LINE__ <<" - " << "Erro: "<< error << " : " << exp; INSTANCE.LogToConsole(PP_LOGLEVEL_ERROR,__logStream.str())

#endif
//chrome-extension://iifpnkedoaiclkodeheciokndhgaalhj/test-multi-track.html
/*mkvparser::MkvReader reader;
	std::stringstream sfilename;
	sfilename << "/persistent/_" << file_name;
	if (!reader.Open(sfilename.str().c_str()))
	{
		Log("Arquivo não pôde ser aberto");
		return false;
	}

	mkvmuxer::MkvWriter final_writer;
	sfilename << "/persistent/" << file_name;
	if (!final_writer.Open(sfilename.str().c_str()))
	{
		LogError(-99, "Escrito não pôde ser aberto");
		return false;
	}

	if (!pSegment->CopyAndMoveCuesBeforeClusters(&reader, &final_writer))
	{
		LogError(-99, "Erro ao criar o arquivo com as cues organizadas");
		return false;
	}

	reader.Close();
	final_writer.Close();
 * */
