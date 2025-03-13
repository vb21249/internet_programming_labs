<?xml version="1.0" encoding="UTF-8"?>
<!-- <?xml-stylesheet type="text/xsl" href="http://xsllab.com/answers.xsl" ?> -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">    
    <xsl:output method="html" indent="yes"/>
    <xsl:template match="/">
    <html>
        <head>
            <title>Answers</title>
            <link rel="stylesheet" type="text/css" href="styles.css"/>
        </head>
        <body>
            <h2>Answers</h2>
            <table border="1">
                <tr>
                    <th>Name</th>
                    <th>Language</th>
                    <th>Interests</th>
                    <th>Technologies</th>
                    <th>Goals</th>
                </tr>
                <xsl:for-each select="questionnaire/answer">
                    <tr>
                        <td><xsl:value-of select="questionnaire/answer/name"/></td>
                        <td><xsl:value-of select="questionnaire/answer/language"/></td>
                        <td><xsl:value-of select="questionnaire/answer/interest"/></td>
                        <td><xsl:value-of select="questionnaire/answer/technologies"/></td>
                        <td><xsl:value-of select="questionnaire/answer/goals"/></td>
                    </tr>
                </xsl:for-each>
            </table>
        </body>
    </html>
    </xsl:template>
</xsl:stylesheet>