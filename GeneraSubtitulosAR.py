#!/usr/bin/python
# coding=utf-8
#
# GeneraSubtitulosAR - v0.5
#
# Notas de Uso:
# Preparar en TextEdit el texto --> IMPORTANTE: menu Fomato->convertir a texto sin formato
#
# Por defecto tiene que existir un xml en el Escritorio de nombre plantilla.xml
# La plantilla se tendra que modificar con cada cambio de temporada de grafismo (abrir xml en FCP y paste atributes
# de la nueva pastilla, luego exportar como xml)
#
# Abrir este script AbrirCon->ExtendScript Toolkit y ejecutarlo
# Tras elegir el archivo que preparamos en TextEdit, genera por defecto mySubs.xml en Escritorio.
# Importar en FCP Import->xml
#
# Regalazo - Agosto de 2.017
# dani.urdiales at g-mail dot com

import tkFileDialog as tk
import re
import math
from os.path import expanduser

home = expanduser("~")

# VARIABLES
oneLineMaxChars = 42
twoLineMaxChars = 90
plantillaXMLPath = home + '/Desktop/plantilla.xml'
finalXMLPath = home + '/Desktop/mySubs.xml'

# TEST VARIABLES
restToSoft = 0.3

# # # # # # # # #  FUNCIONES

def make2lines(str):
    mid_char = int(len(str) / 2)
    index_of_cut_alt1 = str.find(' ', mid_char)
    index_of_cut_alt2 = str.rfind(' ', None, mid_char)
    #print mid_char, index_of_cut_alt1, index_of_cut_alt2
    dist_alt1 = index_of_cut_alt1 - mid_char
    dist_alt2 = mid_char - index_of_cut_alt2
    #print dist_alt1, dist_alt2
    if dist_alt1 <= dist_alt2:
        indexOfCut = index_of_cut_alt1
    else:
        indexOfCut = index_of_cut_alt2

    twoLineStr = str[0:indexOfCut] + '&#13;' + str[indexOfCut+1:len(str)]
    #print twoLineStr
    return twoLineStr


def exportaXML(finalExportList):
    plantillaXML = open(plantillaXMLPath, 'r')
    finalXML = open(finalXMLPath, 'w')

    readXML = plantillaXML.read()
    plantillaXML.close()
    #finalXML.encoding = "UTF8"
    #finalXML.open ("w", "TEXT", "????")
    #  unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
    #  optional
    # finalXML.write("\uFEFF");
    #finalXML.lineFeed = "unix"

    for i in xrange(len(finalExportList)):
        iToSub = str(i + 1)
        replaceStr = ('>' + finalExportList[i] + '<')
        searchStr = ('>PLANTILLASUBS-' + iToSub + '<')
        readXML = readXML.replace(searchStr, replaceStr)

    finalXML.write(readXML)
    finalXML.close()


def beautifyMe(txtToFix):

    # quitamos espacios de inicio y final
    txtToFix = txtToFix.strip()

    # solo un espacio entre palabras
    txtToFix = ' '.join(txtToFix.split())

    # quitamos guiones de inicio
    if txtToFix.startswith('- '):
        txtToFix = txtToFix[2:]
    elif txtToFix.startswith('-'):
        txtToFix = txtToFix[1:]

    # quitamos espacio antes de coma
    while not txtToFix.find(' ,') == -1:
        txtToFix = txtToFix.replace(' ,', ',')

    # quitamos espacio antes de punto …
    while not txtToFix.find(' .') == -1:
        txtToFix = txtToFix.replace(' .', '.')

    # quitamos espacio antes de …
    while not txtToFix.find(' …') == -1:
        txtToFix = txtToFix.replace(' …', '…')

    # quitamos espacio antes de ?
    while not txtToFix.find(' ?') == -1:
        txtToFix = txtToFix.replace(' ?', '?')

    # quitamos espacio antes de !
    while not txtToFix.find(' !') == -1:
        txtToFix = txtToFix.replace(' !', '!')

    # quitamos espacio despues de ¿
    while not txtToFix.find('¿ ') == -1:
        txtToFix = txtToFix.replace('¿ ', '¿')

    # quitamos espacio despues de ¡
    while not txtToFix.find('¡ ') == -1:
        txtToFix = txtToFix.replace('¡ ', '¡')

    #print txtToFix

    return txtToFix

# ABRIR ARCHIVO
#fileToRead = open('/Users/thunder/Desktop/test.txt', 'r')
fileToRead = tk.askopenfile(message='Elige un archivo de texto', mode='r')

if fileToRead:
    fileContents = fileToRead.read()

    # Lista por lineas
    lineaList = re.split('\n|\r', fileContents)

    fileToRead.close()
    # print lineaList

    # Lista por pastillas
    pastillaList = []
    for i in xrange(len(lineaList)):

        #  Beautify
        lineaList[i] = beautifyMe(lineaList[i])

        if len(lineaList[i]) <= twoLineMaxChars:
            pastillaList.append(lineaList[i])
            # print pastillaList
        else:
            # MEJORAR si el decimal cerca de 0 multiplicar twoLineMaxChars por un indice de correccion
            numOfCuts = int(math.ceil(len(lineaList[i]) / float(twoLineMaxChars)))
            corrFactor = 1
            pastCutRest = (len(lineaList[i]) % twoLineMaxChars) / float(twoLineMaxChars)
            if pastCutRest < restToSoft:
                corrFactor = 1 - (restToSoft-pastCutRest)

            corrMaxChars = twoLineMaxChars * corrFactor
            #print 'pastCutRest = ' + str(pastCutRest) + ' / corrFactor = ' + str(corrFactor)\
            #      + ' / corrMaxChars = ' + str(corrMaxChars)
            startIndex = 0
            dirtyFix = lineaList[i] + ' '
            #print numOfCuts, int(math.ceil(len(lineaList[i]) / float(twoLineMaxChars)))

            for j in xrange(numOfCuts):
                cutIndex = dirtyFix.rfind(' ', startIndex, startIndex+corrMaxChars) #dirtyFix.rfind(' ', rfindStart, rfindStart+corrMaxChars)
                #print startIndex, startIndex+corrMaxChars, cutIndex
                pastillaList.append(lineaList[i][startIndex:cutIndex])  # aquies
                startIndex = cutIndex + 1
                #print pastillaList

    # check 2 LINEAS
    for i in xrange(len(pastillaList)):
        if len(pastillaList[i]) > oneLineMaxChars:
            # pasalo a make2lines
            pastillaList[i] = make2lines(pastillaList[i])

    exportaXML(pastillaList)